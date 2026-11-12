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

function Footer() {
	return (
		<>
			<section id="footer">
				<div id="contact">
					<FaBug />
					&nbsp; &nbsp;
					<FaQuestionCircle />
					&nbsp; &nbsp;
					<FaComment />
					<h2>Bugs / Questions / Comments</h2>
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
				<div>
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
		</>
	);
}

export default Footer;
