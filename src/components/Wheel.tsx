import { useState } from "react";

//INFO: list of the first 7 non-black ANSI colors
//see: https://en.wikipedia.org/wiki/ANSI_escape_code#8-bit
const colors = [
	"#800000",
	"#008000",
	"#808000",
	"#000080",
	"#800080",
	"#008080",
	"#3C4143",
];

const colors2 = [
	"#60686C",
	"#CC0000",
	"#33CC00",
	"#999900",
	"#0000CC",
	"#CC00CC",
	"#00CCCC",
];

//BUG: There seems to be an issue when you click out of the browser where the button isn't pressable?
//i'm not sure how to replicate it, but it is consistent whenever i seem to be out of the browser and click something else

interface Label {
	label: string;
}

interface Data {
	items: Label[];
}

function Wheel({ data }: Data) {
	//TODO: fix spacing so that it takes as much space as the wheel
	//circle saying the wheel needs at least two entries:
	//currently: {
	//	list them
	//}
	if (data.length < 2) return (<div><h1>Need at least 2 entries for the wheel</h1></div>);
	//length of arc that the slice will cover in degrees
	const sliceAngleLength = 360 / data.length;

	const [rotation, setRotation] = useState(0);
	const [spinning, setSpinning] = useState(false);

	//returns the angle of the winning segment (where teh pointer points to)
	const winner = (() => {
		//normalize so 0° = pointer at top, rotating clockwise
		const normalized = (360 - (rotation % 360) + sliceAngleLength / 2) % 360;

		//return whatever angle is within the pointed arc
		return Math.floor(normalized / sliceAngleLength) % data.length;
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
			else {
				setSpinning(false);
			}
		};
		requestAnimationFrame(animate);
	};

	//used for uniformity in the wheel measurements
	const size = 200;

	return (
		<div id="wheel">
			{/* winning slice's label is displayed here */}
			{spinning ? (
				<h1>&nbsp;</h1>
			) : (
				<h1 id="wheel-winner">{data[winner].label}</h1>
			)}

			{/* static pointer at top */}
			<svg id="wheel-pointer" viewBox="0 0 40 40">
				<title>Wheel Pointer</title>
				<polygon points="20,38 12,10 28,10" fill="#E6E6E6" />
			</svg>

			{/* rotating wheel */}
			<svg
				id="wheel-svg"
				viewBox={`0 0 ${size} ${size}`}
				width={300}
				height={300}
				style={{ transform: `rotate(${rotation}deg)` }}
			>
				<title>Wheel</title>
				{data.map((item, index) => {
					//simplifies calcs
					const r = size / 2;

					//(cx, cy) = center of space
					const cx = r;
					const cy = r;

					const startAngle = (index * sliceAngleLength - 90) * (Math.PI / 180);
					const endAngle =
						((index + 1) * sliceAngleLength - 90) * (Math.PI / 180);

					//(x1,y1) is the point where the line segment meets the start of the arc
					const x1 = cx + r * Math.cos(startAngle);
					const y1 = cy + r * Math.sin(startAngle);

					//(x2, y2) is the point where the arc ends and meets the line segment
					const x2 = cx + r * Math.cos(endAngle);
					const y2 = cy + r * Math.sin(endAngle);

					//middle angle inside the arc
					const mid = (startAngle + endAngle) / 2;

					//(lx,ly) is the point where we add the text
					const lx = cx + Math.cos(mid) * r * 0.9; //offset a small bit to move text away from arc edge
					const ly = cy + Math.sin(mid) * r * 0.9; //offset a small bit to move text away from arc edge

					//INFO: large is not needed since the angle of every slice will always be =< 180 deg.
					//
					// The drawing is as follows:
					// 	draw a straight line from center to (x1,y1)
					// 	then draw an arc from (x1,y1) to (x2,y2) without any rotation or large flag, but with the sweep flag
					//	then return to the origin
					// once the drawing is finished, we add the color
					// followed by the text
					return (
						<g key={item.label}>
							<path
								d={`M ${cx} ${cy}
								L ${x1},${y1}
								A ${r} ${r} 0 0 1 ${x2},${y2} 
								Z`}
								//fill={colors[index % colors.length]}
								fill={colors2[index % colors.length]}
								//TODO: needs to be between colors2 and below fill
								//fill={`hsl(${(index * 360) / data.length}, 70%, 60%)`} //fill={colors2[i % colors.length]}
							/>
							<text
								x={lx}
								y={ly}
								textAnchor="start"
								dominantBaseline="middle"
								fill="#fff"
								fontSize="10"
								fontWeight="bold"
								transform={`rotate(${mid * (180 / Math.PI) + 180}, ${lx}, ${ly})`}
							>
								{item.label.length > 9
									? `${item.label.slice(0, 9)}...`
									: item.label}
							</text>
						</g>
					);
				})}
			</svg>

			{/* Spin button which gets moved to teh center of the wheel via css */}
			<button
				id="wheel-button"
				type="button"
				onClick={spin}
				disabled={spinning}
			>
				Spin
			</button>
		</div>
	);
}

export default Wheel;
