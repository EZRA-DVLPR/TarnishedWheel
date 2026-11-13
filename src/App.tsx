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
	"#3C4143",
];

type Segment = {
	segmentText: string;
	segColor: string;
};

// modWheel is the wheel that gets displayed
let modWheel: Segment[] = [];

//displays the wheel and checkbox based on the given wheel data
function SegmentList({ segments }: { segments: Segment[] }) {
	// holds record of state for the given segment[]
	const [checked, setChecked] = useState<Record<string, boolean>>(() =>
		Object.fromEntries(segments.map((s) => [s.segmentText, true])),
	);

	// flips bool for the given named segmentText
	const toggle = (name: string) => {
		setChecked((prev) => ({ ...prev, [name]: !prev[name] }));
	};
	//BUG: when toggling, it doesn't update the color to be displayed with the slice
	//this color choice should be recreated upon toggle

	// toggles all true
	const selectAll = () => {
		setChecked(Object.fromEntries(segments.map((s) => [s.segmentText, true])));
	};

	// toggles all false
	const selectNone = () => {
		setChecked({});
	};

	// update modWheel to match always those that are checked
	modWheel = segments.filter((s) => checked[s.segmentText]);

	// display the wheel
	// the buttons to (de)select all
	// then the checkbox below
	return (
		<>
			<SpinWheel
				segments={modWheel}
				onFinished={(result) => console.log(`Spun to: ${result}`)}
				arrowLocation={"top"}
			/>
			<div id="wheelbox-buttons">
				<button type="button" onClick={selectAll}>
					Select All
				</button>
				<button type="button" onClick={selectNone}>
					Clear All
				</button>
			</div>
			<div id="wheelbox">
				{segments.map((s) => (
					<label key={s.segmentText} id="wheelbox-item">
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

// localstorage handling of [value, setValue] paired React State Hooks
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
	const [selectedWheel, setSelectedWheel] = useLocalStorage(
		"selectedWheel",
		"Stat",
	);

	//fills the given wheel with the given json data
	function fillWheel(wheel, data) {
		data.items.forEach((item, index) => {
			if (
				item.DLC == null ||
				item.DLC === "False" ||
				(item.DLC === "True" && valDLC)
			) {
				wheel.push({
					segmentText: item.label,
					segColor: colors[index % 7],
				});
			}
		});
	}

	function fillSelectedWheel(selectedWheel, selWheel) {
		switch (selectedWheel) {
			case "Stat": {
				fillWheel(selWheel, StatData);
				break;
			}
			case "Concept": {
				fillWheel(selWheel, ConceptData);
				break;
			}
			case "Weapon": {
				fillWheel(selWheel, WeaponData);
				break;
			}
			case "Theme": {
				fillWheel(selWheel, ThemeData);
				break;
			}
			default: {
				console.log("Error on selecting wheel - Undefined wheel caught");
				console.log(selectedWheel);
				break;
			}
		}
	}

	//the wheel that will be modified and displayed
	const selWheel: Segment[] = [];

	// whenever a change occurs to selectedWheel, we want to reflect this
	const displaySelectedWheel = fillSelectedWheel(selectedWheel, selWheel);

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

				<div>
					<button type="button" onClick={(e) => setSelectedWheel("Stat")}>
						Stat
					</button>
					<button type="button" onClick={(e) => setSelectedWheel("Concept")}>
						Concept
					</button>
					<button type="button" onClick={(e) => setSelectedWheel("Weapon")}>
						Weapon
					</button>
					<button type="button" onClick={(e) => setSelectedWheel("Theme")}>
						Theme
					</button>
				</div>

				<SegmentList key={selectedWheel} segments={selWheel} />
			</section>

			<Footer />

			<section id="spacer" />
		</>
	);
}

export default App;
