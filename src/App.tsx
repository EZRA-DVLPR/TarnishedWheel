import { useState } from "react";
//import heroImg from "./assets/hero.png";
import "./App.css";

//icons
import { FaQuestionCircle, FaComment } from "react-icons/fa";
import {
	FaGithub,
	FaYoutube,
	FaXTwitter,
	FaDiscord,
	FaBug,
} from "react-icons/fa6";
import { LuNotebookPen, LuMail } from "react-icons/lu";
import { BsPersonWorkspace } from "react-icons/bs";

//import the json data
import StatData from "./data/StatBuilds.json";
import WeaponData from "./data/WeaponBuilds.json";

//TODO: make the wheel myself. it fuckin lags??? are we serious??? in the big 26???
//methinks an SVG that just gets rotated, similar to the obsidian plugin.
import { SpinWheel } from "spin-wheel-game";

//list of the first 8 ANSI colors see:
//https://en.wikipedia.org/wiki/ANSI_escape_code#8-bit
const colors = [
	"#800000",
	"#008000",
	"#808000",
	"#000080",
	"#800080",
	"#008080",
	"#C0C0C0",
];

type Segment = {
	segmentText: string;
	segColor: string;
};

let modWheel: Segment[] = [];

function SegmentList({ segments }: { segments: Segment[] }) {
	const [checked, setChecked] = useState<Record<string, boolean>>(() =>
		Object.fromEntries(segments.map((s) => [s.segmentText, true])),
	);

	const toggle = (name: string) => {
		setChecked((prev) => ({ ...prev, [name]: !prev[name] }));
	};
	//BUG: when toggling, it doesn't update the color to be displayed with the slice
	//this color choice should be recreated upon toggle

	modWheel = segments.filter((s) => checked[s.segmentText]);

	const selected = segments
		.map((s) => s.segmentText)
		.filter((name) => checked[name]);

	return (
		<>
			<SpinWheel
				segments={modWheel}
				onFinished={(result) => console.log(`Spun to: ${result}`)}
				arrowLocation={"top"}
			/>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "flex-start",
				}}
			>
				{segments.map((s) => (
					<label key={s.segmentText}>
						<input
							type="checkbox"
							checked={!!checked[s.segmentText]}
							onChange={() => toggle(s.segmentText)}
						/>
						{s.segmentText}
					</label>
				))}
			</div>
		</>
	);
}

const statWheel: Segment[] = [];
const weaponWheel: Segment[] = [];

//using the data from the json, insert into a segs
//utilizing the index as the value of the color
StatData.items.forEach((item, index) => {
	statWheel.push({
		segmentText: item.label,
		segColor: colors[index % 7],
	});
});

WeaponData.items.forEach((item, index) => {
	weaponWheel.push({
		segmentText: item.label,
		segColor: colors[index % 7],
	});
});

function App() {
	//TODO: recall from local storage
	const [valDLC, setDLC] = useState(true);

	return (
		<>
			<section id="center">
				<div>
					<input
						type="checkbox"
						id="dlc-toggle"
						checked={valDLC}
						onChange={(e) => setDLC(e.target.checked)}
					/>
					<label htmlFor="dlc-toggle">
						Include the DLC - Shadow of the Erdtree
					</label>
				</div>

				<p>DLC Value {String(valDLC)}</p>

				<SegmentList segments={statWheel} />

				<SegmentList segments={weaponWheel} />
			</section>

			<div className="ticks" />

			<section id="next-steps">
				<div id="docs">
					<FaBug />
					&nbsp; &nbsp;
					<FaQuestionCircle />
					&nbsp; &nbsp;
					<FaComment />
					<h2>Bugs / Questions / Comments?</h2>
					<p>Message me here</p>
					<ul>
						<li>
							<a
								href="mailto:EZRA-DVLPR@protonmail.com?subject=Tarnished%20Wheel%20-%20"
								target="_blank"
								rel="noreferrer"
							>
								<LuMail />
								EZRA-DVLPR [at] protonmail.com
							</a>
						</li>
						<li>
							{/*TODO: Fix the link */}
							<a
								href="https://ezra-dvlpr.com/blog"
								target="_blank"
								rel="noreferrer"
							>
								<FaDiscord />
								Discord
							</a>
						</li>
					</ul>
				</div>
				<div id="social">
					<BsPersonWorkspace />
					<h2>Stay Connected</h2>
					<p>Stay up to date with my projects</p>
					<ul>
						<li>
							<a
								href="https://github.com/EZRA-DVLPR"
								target="_blank"
								rel="noreferrer"
							>
								<FaGithub />
								GitHub
							</a>
						</li>
						<li>
							{/*TODO: Fix the link */}
							<a
								href="https://ezra-dvlpr.com/blog"
								target="_blank"
								rel="noreferrer"
							>
								<FaDiscord />
								Discord
							</a>
						</li>
						<li>
							<a
								href="https://x.com/IsaiahMTech"
								target="_blank"
								rel="noreferrer"
							>
								<LuNotebookPen />
								Blog
							</a>
						</li>
						<li>
							<a
								href="https://www.youtube.com/@EZRA-DVLPR"
								target="_blank"
								rel="noreferrer"
							>
								<FaYoutube />
								YouTube
							</a>
						</li>
					</ul>
				</div>
			</section>
			<section id="spacer" />
		</>
	);
}

export default App;
