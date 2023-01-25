import { useParams } from "react-router-dom";
import EditTriviaForm from "./EditTriviaSection";
import AddTriviaForm from "./AddTriviaSection";
import { useLocation } from "react-router-dom";
const AddTriviaPage = () => {
	const { triviapackageId } = useParams();
	const trivPackageId = parseInt(triviapackageId);

	const location = useLocation();
	// const sessionUser = useSelector((state) => state.session.user);
	const sessionUser = location.state?.sessionUser;
	const triviapackage = location.state?.triviapackage;

	return (
		<div>
			{sessionUser && triviapackage && (
				<div className="add-trivia-page-header-container">
					<h1>THIS IS TO ADD TRIVIA PAGE</h1>
				</div>
			)}
			<div className="add-trivia-page-form-container">
				<AddTriviaForm
					sessionUser={sessionUser}
					triviapackage={triviapackage}
				/>
			</div>

			<div className="add-trivia-page-edit-container">
				<EditTriviaForm
					sessionUser={sessionUser}
					triviapackage={triviapackage}
				/>
			</div>
		</div>
	);
};

export default AddTriviaPage;
