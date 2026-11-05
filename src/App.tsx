import { useState } from "react";
import heroImg from "./assets/hero.png";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import "./App.css";

//import the json data
import StatData from "./data/StatBuilds.json";
import WeaponData from "./data/WeaponBuilds.json";

//TODO: make the wheel myself. it fuckin lags??? are we serioous??? in the big 26???
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
	"#C0C0C0"
]

type Segment = {
	segText: string;
	segColor: string;
}

let statWheel: Segment[] = [];
let weaponWheel: Segment[] = [];

//using the data from the json, insert into a segs
//utilizing the index as the value of the color
StatData.items.forEach((item, index) => {
	statWheel.push({
		segmentText: item.label,
		segColor: colors[index % 7],
	})
})

WeaponData.items.forEach((item, index) => {
	weaponWheel.push({
		segmentText: item.label,
		segColor: colors[index % 7],
	})
})

function App() {
	const [count, setCount] = useState(0);

	//TODO: recall from local storage
	const [valDLC, setDLC] = useState(true);

	return (
		<>
			<section id="center">
				<div className="hero">
					<img src={heroImg} className="base" width="170" height="179" alt="" />
					<img src={reactLogo} className="framework" alt="React logo" />
					<img src={viteLogo} className="vite" alt="Vite logo" />
				</div>
				<div>
					<h1>Get started</h1>
					<p>
						Edit <code>src/App.tsx</code> and save to test <code>HMR</code>
					</p>
				</div>
				<button
					type="button"
					className="counter"
					onClick={() => setCount((count) => count + 1)}
				>
					Count is {count}
				</button>
				<button
					type="button"
					className="reset"
					onClick={() => setCount((count) => 0)}
				>
					Reset Count
				</button>

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

				<SpinWheel
					segments={statWheel}
					onFinished={(result) => console.log(`Spun to: ${result}`)}
					arrowLocation={"top"}
				/>

				<SpinWheel
					segments={weaponWheel}
					onFinished={(result) => console.log(`Spun to: ${result}`)}
					arrowLocation={"top"}
				/>
			</section>

			<div className="ticks" />

			<section id="next-steps">
				<div id="docs">
					<svg className="icon" role="presentation" aria-hidden="true">
						<use href="/icons.svg#documentation-icon" />
					</svg>
					<h2>Documentation</h2>
					<p>Your questions, answered</p>
					<ul>
						<li>
							<a href="https://vite.dev/" target="_bank">
								<img className="logo" src={viteLogo} alt="" />
								Explore Vite
							</a>
						</li>
						<li>
							<a href="https://react.dev/" target="_blank">
								<img className="button-icon" src={reactLogo} alt="" />
								Learn more
							</a>
						</li>
					</ul>
				</div>
				<div id="social">
					<svg className="icon" role="presentation" aria-hidden="true">
						<use href="/icons.svg#social-icon"></use>
					</svg>
					<h2>Connect with us</h2>
					<p>Join the Vite community</p>
					<ul>
						<li>
							<a href="https://github.com/vitejs/vite" target="_blank">
								<svg
									className="button-icon"
									role="presentation"
									aria-hidden="true"
								>
									<use href="/icons.svg#github-icon"></use>
								</svg>
								GitHub
							</a>
						</li>
						<li>
							<a href="https://chat.vite.dev/" target="_blank">
								<svg
									className="button-icon"
									role="presentation"
									aria-hidden="true"
								>
									<use href="/icons.svg#discord-icon"></use>
								</svg>
								Discord
							</a>
						</li>
						<li>
							<a href="https://x.com/vite_js" target="_blank">
								<svg
									className="button-icon"
									role="presentation"
									aria-hidden="true"
								>
									<use href="/icons.svg#x-icon"></use>
								</svg>
								X.com
							</a>
						</li>
						<li>
							<a href="https://bsky.app/profile/vite.dev" target="_blank">
								<svg
									className="button-icon"
									role="presentation"
									aria-hidden="true"
								>
									<use href="/icons.svg#bluesky-icon"></use>
								</svg>
								Bluesky
							</a>
						</li>
					</ul>
				</div>
			</section>

			<div className="ticks"></div>
			<section id="spacer"></section>
		</>
	);
}

export default App;
