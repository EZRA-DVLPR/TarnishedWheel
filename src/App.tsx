//INFO:keeping just in case i want to import images for later
//import heroImg from "./assets/hero.png";
import { useState, useEffect } from "react";
import "./App.css";

//import Data type for processing the wheel data
import type Data from "../types"

//import the json data
import StatData from "./data/StatBuilds.json";
import WeaponData from "./data/WeaponBuilds.json";
import ThemeData from "./data/ThemeBuilds.json";
import ConceptData from "./data/ConceptBuilds.json";

//import other components
import Header from "./components/Header.tsx";
import Footer from "./components/Footer.tsx";
import Wheel from "./components/Wheel.tsx";

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

//localstorage handling of [value, setValue] paired React State Hooks
const useLocalStorage = (storageKey, fallbackState) => {
	//creation of value and setting of value with localstorage
	const [value, setValue] = useState(
		JSON.parse(localStorage.getItem(storageKey)) ?? fallbackState,
	);

	//store JSON-ified string
	useEffect(() => {
		localStorage.setItem(storageKey, JSON.stringify(value));
	}, [value, storageKey]);

	return [value, setValue];
};

function App() {
	//modWheel is the wheel that gets displayed on screen after selection from the user
	//the data inside will be rewritten, so it is initialized to an empty slice []
	let myWheel: Data = { items: [] };

	//INFO: these hooks matter in persistent sessions

	//DLC check for the wheels to display DLC only content
	const [valDLC, setDLC] = useLocalStorage("valDLC", true);

	//currently selected wheel
	const [selectedWheel, setSelectedWheel] = useLocalStorage(
		"selectedWheel",
		"Stat",
	);

	//toggle for showing/hiding the delete buttons on the slices
	const [deletionMode, setDeletionMode] = useLocalStorage("deletionMode", true);

	//custom wheel information
	const [userWheelData, setUserWheelData] = useState(() => {
		return JSON.parse(localStorage.getItem("userWheelData")) || [];
	});

	//INFO: user input box should not persist across sessions
	const [inputValue, setInputValue] = useState("");

	//updates localstorage with the new user wheel data
	const saveUserWheelData = (newArray) => {
		setUserWheelData(newArray);
		localStorage.setItem("userWheelData", JSON.stringify(newArray));
	};

	//removes the elt @ index for user wheel data
	const removeAt = (index) => {
		const copy = [...userWheelData];
		copy.splice(index, 1);
		saveUserWheelData(copy);
	};

	//populates the given wheel with the given json data
	function DLCCheck(wheelData, data) {
		data.items.forEach((item) => {
			if (
				item.DLC == null || //if no mention of DLC then DLC does not need to be true, then display
				item.DLC === "False" || //if DLC is mentioned and set to 'False', then display
				(item.DLC === "True" && valDLC) //if DLC is mentioned and set to 'True', valDLC must also be true to be displayed
			) {
				wheelData.items.push(item);
			}
		});
	}

	//selects the data to be input into the wheel by either checking DLC, or sanitizing it for further use
	function fillSelectedData(selectedWheel, selData) {
		switch (selectedWheel) {
			case "Stat": {
				DLCCheck(selData, StatData);
				break;
			}
			case "Concept": {
				DLCCheck(selData, ConceptData);
				break;
			}
			case "Weapon": {
				DLCCheck(selData, WeaponData);
				break;
			}
			case "Theme": {
				DLCCheck(selData, ThemeData);
				break;
			}
			case "Custom": {
				//INFO:we want to re-create the syntax of the JSON with the custom data
				//[
				//{"label": userWheelData[0]},
				//{"label": userWheelData[1]},
				//...
				//]
				//no need to check dlc for user entries
				selData.items = userWheelData.map((value) => ({ label: value }));
				break;
			}
			default: {
				console.log("Error on selecting wheel - Undefined wheel caught");
				console.log(selectedWheel);
				break;
			}
		}
	}

	//the data for the wheel that will be modified and displayed
	const selData: Data = { items: [] };

	//reflect changes to selectedWheel
	const displaySelectedData = fillSelectedData(selectedWheel, selData);

	//takes the given data and displays it in the wheel
	//adds wheel related functions like checkbox, clear/select all, etc.
	function DrawWheel({ data }: Data) {
		//holds record of display state for the given slice[]
		const [checked, setChecked] = useState<Record<string, boolean>>(() =>
			Object.fromEntries(data.items.map((item) => [item.label, true])),
		);

		//flips bool for the given segmentText
		const toggle = (name: string) => {
			setChecked((prev) => ({ ...prev, [name]: !prev[name] }));
		};

		//toggles all true
		const selectAll = () => {
			setChecked(
				Object.fromEntries(data.items.map((item) => [item.label, true])),
			);
		};

		//toggles all false
		const selectNone = () => {
			setChecked({});
		};

		//update myWheel to match always those that are checked
		myWheel = data.items.filter((item) => checked[item.label]);

		//TODO: handle the checkbox better. maybe balance the amount of entries that are in each colmn so its more balanced
		//BUG: Handle really long names as the winner
		return (
			<>
				<Wheel data={myWheel} />
				<div id="wheelbox-buttons">
					<button type="button" onClick={selectAll}>
						Select All
					</button>
					<button type="button" onClick={selectNone}>
						Clear All
					</button>
				</div>
				{selectedWheel === "Custom" ? (
					<div>
						<input
							type="checkbox"
							id="deletionMode"
							checked={deletionMode}
							onChange={(e) => setDeletionMode(e.target.checked)}
						/>
						<label htmlFor="deletionMode">Deletion Mode</label>
					</div>
				) : null}
				<div id="wheelbox">
					{data.items.map((item, index) => (
						<label key={item.label} id="wheelbox-item">
							<input
								type="checkbox"
								checked={!!checked[item.label]}
								onChange={() => toggle(item.label)}
							/>
							{item.label}
							{/*INFO: Only display the delete button when the custom wheel is selected*/}
							{selectedWheel === "Custom" && deletionMode ? (
								<button
									id="wheelbox-delete"
									type="button"
									onClick={() => removeAt(index)}
								>
									x
								</button>
							) : null}
						</label>
					))}
				</div>
			</>
		);
	}

	return (
		<>
			<section id="spacer" />

			<Header />

			<section id="center">
				<DrawWheel key={`${selectedWheel}-2`} data={selData} />
				{/*TODO: I am curious on the UI/UX, since it shifts the stuff down. Fiddle with empty space so that it doesn't move the rest of the data vertically*/}
				{selectedWheel !== "Custom" ? (
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
				) : null}
				<div>
					<button type="button" onClick={() => setSelectedWheel("Stat")}>
						Stat
					</button>
					<button type="button" onClick={() => setSelectedWheel("Concept")}>
						Concept
					</button>
					<button type="button" onClick={() => setSelectedWheel("Weapon")}>
						Weapon
					</button>
					<button type="button" onClick={() => setSelectedWheel("Theme")}>
						Theme
					</button>
					<button type="button" onClick={() => setSelectedWheel("Custom")}>
						Custom
					</button>
				</div>
				{selectedWheel === "Custom" ? (
					<div>
						{/* INFO: This should have some bounds so I can infer space used.
						Basic maths:
							- ~5 MB of maximum storage allowed for domain
							- only strings can be stored
							- already using localstorage for other stuff
							- UTF-16 encoding for strings 
								 => 2 bytes per character in Basic Latin
							=> total size = (~5 million bytes) - 
								(however many other bytes for localstorage stuff)
							If we give users the option of 100 elements on the wheel
								(pretty large probably number) as well as maximum length 
								(50 characters)
							=> 10,000 bytes used. Well below the localstorage limit.
							We can increase it to even 1000 elements, barely achieving
								100,000 bytes, barely 2% of the limit.
							In reality, most users will probably not need 1000 elements or
								500 character length, but any desire to increase max
								size of the array or individual element is totally fine,
								even by a magnitude of 10 or 100.
						*/}
						{/* INFO: No sanitization needed since we aren't processing it yet */}
						<input
							type="text"
							maxLength="50"
							minLength="1"
							value={inputValue}
							onChange={(e) => setInputValue(e.target.value)}
							placeholder="Add a new wheel slice..."
						/>
						<button
							type="button"
							onClick={() => {
								//remove whitespace @ ends
								const trimmed = inputValue.trim();

								//empty input so return
								if (!trimmed) return;

								//TODO: prevent duplicate entries including capitalization changes

								//TODO: prevent adding more elts if the current wheel has 100 elts.

								//append the new value
								saveUserWheelData([...userWheelData, trimmed]);

								//reset value of input box to empty string
								setInputValue("");
							}}
						>
							Add Custom Wheel Slice
						</button>
					</div>
				) : null}{" "}
			</section>

			<Footer />

			<section id="spacer" />
		</>
	);
}

export default App;
