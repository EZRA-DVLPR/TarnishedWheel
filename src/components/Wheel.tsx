import { useState } from "react";

// TODO: import the wheel data instead of this for testing
const SEGMENTS = [
	"Prize A",
	"Prize B",
	"Prize C",
	"Prize D",
	"Prize E",
	"Prize F",
	"Prize A",
	"Prize B",
	"Prize C",
	"Prize D",
	"Prize E",
	"Prize F",
	"Prize E",
	"Prize F",
];

//length of arc that the slice will cover in degrees
const sliceAngleLength = 360 / SEGMENTS.length;

function Wheel() {
	const [rotation, setRotation] = useState(0);
	const [spinning, setSpinning] = useState(false);

	//returns the angle of the winning segment (where teh pointer points to)
	const winner = (() => {
		//normalize so 0° = pointer at top, rotating clockwise
		const normalized = (360 - (rotation % 360) + sliceAngleLength / 2) % 360;

		//return whatever angle is within the pointed arc
		return Math.floor(normalized / sliceAngleLength) % SEGMENTS.length;
	})();

	//spins the svg
	const spin = () => {
		//cant spin if it's spinning already
		if (spinning) return;
		setSpinning(true);

		//random target: 5–8 full turns + random offset
		const turns = 5 + Math.random() * 3;
		const offset = Math.random() * 360;
		const target = rotation + turns * 360 + offset;

		//deceleration towards the end
		const start = rotation;
		const duration = 4000;
		const startTime = performance.now();

		//do the spin
		const animate = (now: number) => {
			const progress = Math.min((now - startTime) / duration, 1);
			const eased = 1 - (1 - progress) ** 3;
			setRotation(start + (target - start) * eased);
			if (progress < 1) requestAnimationFrame(animate);
			else setSpinning(false);
		};
		requestAnimationFrame(animate);
	};

	//used for uniformity in the wheel measurements
	const size = 200;

	return (
		<div className="relative flex items-center justify-center" id="wheel">
			{/* static pointer at top */}
			<svg
				id="wheel-pointer"
				viewBox="0 0 40 40"
				className="absolute left-1/2 top-0 -translate-x-1/2 z-10"
			>
				<title>Wheel Pointer</title>
				<polygon points="20,38 12,10 28,10" fill="#E6E6E6" />
			</svg>

			{/* rotating wheel */}
			<svg
				id="wheel-svg"
				viewBox={`0 0 ${size} ${size}`}
				style={{ transform: `rotate(${rotation}deg)` }}
			>
				<title>Wheel</title>
				{SEGMENTS.map((_, i) => {
					//simplifies calcs
					const r = size / 2;

					//(cx, cy) = center of space
					const cx = r;
					const cy = r;

					const startAngle = (i * sliceAngleLength - 90) * (Math.PI / 180);
					const endAngle = ((i + 1) * sliceAngleLength - 90) * (Math.PI / 180);

					//(x1,y1) is the point where the line segment meets the start of the arc
					const x1 = cx + r * Math.cos(startAngle);
					const y1 = cy + r * Math.sin(startAngle);

					//(x2, y2) is the point where the arc ends and meets the line segment
					const x2 = cx + r * Math.cos(endAngle);
					const y2 = cy + r * Math.sin(endAngle);

					//INFO: large is not needed since the angle of every slice will always be =< 180 deg.
					//
					// The drawing is as follows:
					// 	draw a straight line from center to (x1,y1)
					// 	then draw an arc from (x1,y1) to (x2,y2) without any rotation or large flag, but with the sweep flag
					//	then return to the origin
					return (
						<path
							key={i}
							d={`M ${cx} ${cy}
								L ${x1},${y1}
								A ${r} ${r} 0 0 1 ${x2},${y2} 
								Z`}
							fill={`hsl(${(i * 360) / SEGMENTS.length}, 70%, 60%)`}
						/>
					);
				})}
			</svg>

			<button onClick={spin} disabled={spinning}>
				Spin
			</button>
			{!spinning && <p>Winner: {SEGMENTS[winner]}</p>}
		</div>
	);
}

export default Wheel;
