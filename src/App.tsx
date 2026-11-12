//INFO:keeping just in case i want to import images for later
//import heroImg from "./assets/hero.png";
import { useState, useEffect } from "react";
import "./App.css";

//import the json data
import StatData from "./data/StatBuilds.json";
import WeaponData from "./data/WeaponBuilds.json";
import ThemeData from "./data/ThemeBuilds.json";
import ConceptData from "./data/ConceptBuilds.json";

//import other components
import Header from "./components/Header.tsx";
import Footer from "./components/Footer.tsx";

//TODO: make the wheel myself. it fuckin lags??? are we serious??? in the big 26???
//methinks an SVG that just gets rotated, similar to the obsidian plugin.
import { SpinWheel } from "spin-wheel-game";

//INFO: list of the first 8 ANSI colors see:
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

//displays the wheel and checkbox based on the given wheel data
function SegmentList({ segments }: { segments: Segment[] }) {
	// holds record of state for the given segment[]
	const [checked, setChecked] = useState<Record<string, boolean>>(() =>
		Object.fromEntries(segments.map((s) => [s.segmentText, true])),
	);

	// flips boolean
	const toggle = (name: string) => {
		setChecked((prev) => ({ ...prev, [name]: !prev[name] }));
	};
	//BUG: when toggling, it doesn't update the color to be displayed with the slice
	//this color choice should be recreated upon toggle

	// update modWheel to match always those that are checked
	modWheel = segments.filter((s) => checked[s.segmentText]);

	// display the wheel
	// then the checkbox below it

	//TODO: add clear all
	//TODO: add add all
	//TODO: organize the lists into a better format (2/4 cols based on amt of items?)
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

//declare all wheels based on json stuff
const statWheel: Segment[] = [];
const conceptWheel: Segment[] = [];
const themeWheel: Segment[] = [];
const weaponWheel: Segment[] = [];

//fills the given wheel with the given json data
function fillWheel(wheel, data) {
	data.items.forEach((item, index) => {
		wheel.push({
			segmentText: item.label,
			segColor: colors[index % 7],
		});
	});
}

//fill the wheels with the corresponding data
fillWheel(statWheel, StatData);
fillWheel(conceptWheel, ConceptData);
fillWheel(themeWheel, ThemeData);
fillWheel(weaponWheel, WeaponData);

// localstorage handling
const useLocalStorage = (storageKey, fallbackState) => {
	//creation of value and setting of value with localstorage
	const [value, setValue] = useState(
		JSON.parse(localStorage.getItem(storageKey)) ?? fallbackState,
	);

	//store as JSON-ified string as a pair
	useEffect(() => {
		localStorage.setItem(storageKey, JSON.stringify(value));
	}, [value, storageKey]);

	return [value, setValue];
};

function App() {
	const [valDLC, setDLC] = useLocalStorage("valDLC", true);

	return (
		<>
			<section id="spacer" />

			<Header />

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

				<SegmentList segments={statWheel} />

				<SegmentList segments={weaponWheel} />

				<SegmentList segments={themeWheel} />

				<SegmentList segments={conceptWheel} />
			</section>

			<Footer />

			<section id="spacer" />
		</>
	);
}

export default App;
