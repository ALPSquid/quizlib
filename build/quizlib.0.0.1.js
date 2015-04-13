/**
 * Class that represents an HTML Quiz. Provides methods for checking answers and generating a score.  
 *
 * To use:  
 * *Note:* Required classes are not exclusive; you can still use your own classes alongside them.  
 *
 * **HTML**  
 * Import the QuizLib.js script and optional QuizLibStyle.css stylesheet. The stylesheet provides basic formatting but styling is left open to you.
 * - Create a quiz container element containing child elements for each question. Each question element must use the 'question' class.
 * - Each question element must have a question title element using the class 'question-title'. The unanswered question warning will be appended to this element.
 * - Each question element must also have a question answers element using the class 'question-answers'. This element must contain answers that use the input tag. You can use any input type, quantity and structure you like.
 * - Each answer input must have an arbitrary value which will be used as its answer value.
 * 
 * QuizLib makes use of the following classes (See {{#crossLink "Quiz/Classes:property"}}{{/crossLink}}):
 * - 'quizlib-question': used to identify a question element
 * - 'quizlib-question-title': used to identify the question title element
 * - 'quizlib-question-answers': used to identify the element containing question answers
 * - 'quizlib-question-warning': used by the 'unanswered question warning' element
 * - 'quizlib-correct': added to question titles to highlight correctly answered questions. 
 *    Use freely to take advantage of {{#crossLink "Quiz/highlightResults:method"}}{{/crossLink}} and {{#crossLink "Quiz/clearHighlights:method"}}{{/crossLink}}
 * - 'quizlib-incorrect': added to question titles to highlight incorrectly answered questions.
 *    Use freely to take advantage of {{#crossLink "Quiz/highlightResults:method"}}{{/crossLink}} and {{#crossLink "Quiz/clearHighlights:method"}}{{/crossLink}}
 *
 * *Example:*  
 * ```
 * <!-- Quiz Container -->  
 * <div id="quiz-div">  
 *     <!-- Question 1 -->  
 *     <div class="quizlib-question my-class">  
 *         <div class="quizlib-question-title">1. Question Title</div>  
 *         <div class="quizlib-question-answers">  
 *             <!-- Answer structure can be as simple or as complicated as you like, only the input element matters to the library -->
 *             <input type="radio" name="q1" value="a"> Option 1<br/>
 *             <input type="radio" name="q1" value="b"> Option 2<br/>
 *         </div>  
 *     </div>  
 *     <!-- Question 2 -->  
 *     <div class="quizlib-question my-class">  
 *         <div class="quizlib-question-title">2. Question Title</div>  
 *         <div class="quizlib-question-answers">
 *             <ul>  
 *                 <li><label><input type="checkbox" name="q2" value="a"> Option 1</label></li>  
 *                 <li><label><input type="checkbox" name="q2" value="b"> Option 2</label></li>  
 *                 <li><label><input type="checkbox" name="q2" value="c"> Option 3</label></li>  
 *                 <li><label><input type="checkbox" name="q2" value="d"> Option 4</label></li>  
 *             </ul>  
 *         </div>  
 *     </div>
 *     <!-- Answer Button -->
 *     <button type="button" onclick="myAnswerCheckMethod();">Check Answers</button>
 * </div>
 * ```
 * 
 *
 * **JavaScript**  
 * - Create a new Quiz object where the first parameter is the ID of your quiz container and the second parameter is an array of question answers (input values) in order.
 * - To check answers, call {{#crossLink "Quiz/checkAnswers:method"}}{{/crossLink}} which returns false if some questions have been skipped and marks them with a message appended to the title. Otherwise returns true and updates {{#crossLink "Quiz/result:property"}}{{/crossLink}}
 * - You can then access score data through {{#crossLink "Quiz/result:property"}}{{/crossLink}} which is a {{#crossLink "QuizResult"}}{{/crossLink}} object.
 * 
 * *Example*  
 * 
 * Create the quiz instance  
 * ```
 * var quiz = new Quiz('quiz-div', ['a', ['b', 'c', 'd']]);
 * ```  
 * Create a method to check the answers
 * ```
 * function myAnswerCheckMethod() {
 *     // checkAnswers returns true if all questions have been answered and updates the result object
 *     if (quiz.checkAnswers()) {
 *         console.log('Correct answers: ' + quiz.result.score + '/' + quiz.result.results.length);
 *         console.log('Percent correct: ' + quiz.result.scorePercentFormatted + '%');
 *     }
 * ```
 *
 * @class Quiz
 * @constructor
 * @param {String} quizContainer ID of the quiz container.
 * @param {Array} answers Array of correct answers using the input value. e.g. ['a', 'b', ['a', 'b']].
 *        Can use nested arrays for multi-answers such as checkbox questions
 * @example
 * 		new Quiz('quiz-div', ['a', 'b', ['c', 'd'], 'b', ['a', 'b']]);
 */
var Quiz = function(quizContainer, answers) {
	/**
	 * Enum containing classes used by QuizLib as follows:
	 * - **QUESTION**: 'quizlib-question'
	 *   - used to identify a question element
	 * - **QUESTION_TITLE**: 'quizlib-question-title'
	 *   - used to identify the question title element
	 * - **QUESTION_WARNING**: 'quizlib-question-answers'
	 *   - used to identify the element containing question answers
	 * - **QUESTION_ANSWERS**: 'quizlib-question-warning'
	 *   - used by the 'unanswered question warning' element
	 * - **CORRECT**: 'quizlib-correct'
	 *   - added to question titles to highlight correctly answered questions.  
	 *     Use freely to take advantage of {{#crossLink "Quiz/highlightResults:method"}}{{/crossLink}} and {{#crossLink "Quiz/clearHighlights:method"}}{{/crossLink}}
	 * - **INCORRECT**: 'quizlib-incorrect'
	 *   - added to question titles to highlight incorrectly answered questions.  
	 *     Use freely to take advantage of {{#crossLink "Quiz/highlightResults:method"}}{{/crossLink}} and {{#crossLink "Quiz/clearHighlights:method"}}{{/crossLink}}
	 * 
	 * @property Classes
	 * @type Object
	 * @default See above
	 * @final
	 */
	this.Classes = Object.freeze({
		QUESTION: "quizlib-question", 
		QUESTION_TITLE: "quizlib-question-title",
		QUESTION_ANSWERS: "quizlib-question-answers",
		QUESTION_WARNING: "quizlib-question-warning",
		CORRECT: "quizlib-correct",
		INCORRECT: "quizlib-incorrect"
	});
	
	/*this.QUESTION_CLASS = 'quizlib-question';
	this.QUESTION_TITLE_CLASS= 'quizlib-question-title';
	this.ANSWER_CLASS = 'quizlib-question-answers';
	this.QUESTION_WARNING_CLASS = 'quizlib-question-warning';
	this.CORRECT_CLASS = 'quizlib-correct';
	this.INCORRECT_CLASS = 'quizlib-incorrect';*/

	this.unansweredQuestionText = 'Unanswered Question!';

	// Quiz container element
	this.container = document.getElementById(quizContainer);
	this.questions = [];
	/**
	 * Quiz Result object containing quiz score information. See {{#crossLink "QuizResult"}}{{/crossLink}}
	 *
	 * @property result
	 * @type QuizResult
	 */
	this.result = new QuizResult();
	/**
	 * User defined answers taken from constructor
	 *
	 * @property answers
	 * @type Array
	 */
	this.answers = answers;

	// Get all the questions and add element to the questions array
	for (var i=0; i < this.container.children.length; i++) {
		if (this.container.children[i].classList.contains(this.Classes.QUESTION)) {
			this.questions.push(this.container.children[i]);
		}
	}

	if (this.answers.length != this.questions.length) {
		throw new Error("Number of answers does not match number of questions!");
	}
};

/**
 * Checks quiz answers against provided answers. Calls {{#crossLink "Quiz/clearHighlights:method"}}{{/crossLink}} for each question.
 *
 * @method checkAnswers
 * @param {Boolean} [flagUnanswered=true] Whether to ignore unanswered questions. If false, unanswered questions will not be flagged
 * @return {Boolean} True or if *flagUnanswered* is true: True if all questions have been answered. Otherwise false and unanswered questions are highlighted.
 */
Quiz.prototype.checkAnswers = function(flagUnanswered) {
	if (flagUnanswered === undefined) flagUnanswered = true;
	var unansweredQs = [];
	var questionResults = [];
	for (var i=0; i < this.questions.length; i++) {
		var question = this.questions[i];
		var answer = this.answers[i];
		var userAnswer = [];
		
		this.clearHighlights(question);
		
		// Get answers
		var answerInputs = question.getElementsByClassName(this.Classes.QUESTION_ANSWERS)[0].getElementsByTagName('input');
		for (var k=0; k < answerInputs.length; k++) {
			if (answerInputs[k].checked) {
				userAnswer.push(answerInputs[k].value);
			}
		}
		// Remove single answer from array to match provided answer format
		if (userAnswer.length == 1 && !Array.isArray(answer)) {
			userAnswer = userAnswer[0];
		} else if (userAnswer.length === 0) {
			unansweredQs.push(question);
		}
		
		questionResults.push(Utils.compare(userAnswer, answer));
	}

	if (unansweredQs.length === 0 || !flagUnanswered) {
		this.result.setResults(questionResults);
		return true;
	}
	else {
		// Highlight unanswered questions if set
		for (i=0; i < unansweredQs.length; i++) {
			var warning = document.createElement('span');
			warning.appendChild(document.createTextNode(this.unansweredQuestionText));
			warning.className = this.Classes.QUESTION_WARNING;
			unansweredQs[i].getElementsByClassName(this.Classes.QUESTION_TITLE)[0].appendChild(warning);
		}
	}
	return false;
};

/**
 * Clears highlighting for a question element (correct and incorrect classes), including unanswered question warnings
 * 
 * @method clearHighlights
 * @param {HTMLDocument} question Question element to clear
 */
Quiz.prototype.clearHighlights = function(question) {
	// Remove question warning if it exists
	var questionWarnings = question.getElementsByClassName(this.Classes.QUESTION_WARNING);
	for (var i=0; i < questionWarnings.length; i++) {
		question.getElementsByClassName(this.Classes.QUESTION_TITLE)[0].removeChild(questionWarnings[i]);
	}
	
	// Remove highlighted elements
	var highlightedQuestions = [question.getElementsByClassName(this.Classes.CORRECT), question.getElementsByClassName(this.Classes.INCORRECT)];
	var highlightedElement;
	for (i=0; i < highlightedQuestions.length; i++) {
		while (highlightedQuestions[i].length > 0) {
			highlightedElement = highlightedQuestions[i][0];
			highlightedElement.classList.remove(this.Classes.CORRECT);
			highlightedElement.classList.remove(this.Classes.INCORRECT);
		}
	}
};

/** 
 * Highlights correctly and incorrectly answered questions by:  
 * - Adding the class 'quizlib-correct' to correctly answered question titles
 * - Adding the class 'quizlib-incorrect' to incorrectly answered question titles
 * 
 * @method highlightResults
 * @param {Function} [questionCallback] Optional callback for each question with the following arguments:
 * 1. Element: the question element
 * 2. Number: question number
 * 3. Boolean: true if correct, false if incorrect.  
 * 
 * This allows you to further customise the handling of answered questions (and decouples the library from a specific HTML structure), for example highlighting the correct answer(s) on incorrect questions.
 * 
 * @example
 * ```
 *    // Method Call
 *    quiz.highlightResults(handleAnswers);
 *    
 *    // handleAnswers callback
 *    function handleAnswers(questionElement, questionNo, correctFlag) {
 *        ...
 *    }
 * ```
 */
Quiz.prototype.highlightResults = function(questionCallback) {
	var question;
	for (var i=0; i < this.questions.length; i++) {
		question = this.questions[i];
		if (this.result.results[i]) {
			question.getElementsByClassName(this.Classes.QUESTION_TITLE)[0].classList.add(this.Classes.CORRECT);
			if (questionCallback !== undefined) questionCallback(question, i, true);
		}
		else {
			question.getElementsByClassName(this.Classes.QUESTION_TITLE)[0].classList.add(this.Classes.INCORRECT);
			if (questionCallback !== undefined) questionCallback(question, i, false);
		}
	}
};


/**
 * Quiz Result class that holds score information
 *
 * @class QuizResult
 * @constructor
 */
var QuizResult = function() {
	/**
	 * Array of booleans where the index is the question number and the value is whether the question was answered correctly. Updated by {{#crossLink "QuizResult/setResults:method"}}{{/crossLink}}
	 * @property results
	 * @type Array
	 */
	this.results = [];
	/**
	 * Number of questions answered correctly. Updated by {{#crossLink "QuizResult/setResults:method"}}{{/crossLink}}
	 * @property results
	 * @type Array
	 */
	this.totalQuestions = 0;
	/**
	 * Number of questions answered correctly. Updated by {{#crossLink "QuizResult/setResults:method"}}{{/crossLink}}
	 * @property score
	 * @type Number
	 */
	this.score = 0;
	/**
	 * Percentage score between 0 and 1. Updated by {{#crossLink "QuizResult/setResults:method"}}{{/crossLink}}
	 * @property scorePercent
	 * @type Number
	 */
	this.scorePercent = 0;
	/**
	 * Formatted score percent that's more useful to humans (1 - 100). Percent is rounded down. Updated by {{#crossLink "QuizResult/setResults:method"}}{{/crossLink}}
	 * @property scorePercentFormatted
	 * @type Number
	 */
	this.scorePercentFormatted = 0;
};

/**
 * Calculates score information from an array of question results and updates properties
 *
 * @method setResults
 * @param {Array} questionResults Array of question results where the index is the question number and the value is whether the question was answered correctly. e.g. [true, true, false]
 */
QuizResult.prototype.setResults = function(questionResults) {
	this.results = questionResults;
	this.totalQuestions = this.results.length;
	this.score = 0;
	for (var i=0; i < this.results.length; i++) {
		if (this.results[i]) this.score++;
	}
	this.scorePercent = this.score / this.totalQuestions;
	this.scorePercentFormatted = Math.floor(this.scorePercent * 100);
};


/**
 * Utils class that provides useful methods
 *
 * @class Utils
 */
var Utils = function() {};
/**
 * Compare two objects without coercion. If objects are arrays, their contents will be compared, including order.
 *
 * @method compare
 * @param {Object} obj1 main object
 * @param {Object} obj2 object to compare obj1 against
 * @return {boolean} True if objects are equal
 */
Utils.compare = function(obj1, obj2) {
	if (obj1.length != obj2.length) return false;

	if (Array.isArray(obj1) && Array.isArray(obj2)) {
		for (var i=0; i < obj1.length; i++) {
			if (obj1[i] !== obj2[i]) return false;
		}
		return true;
	}
	return obj1 === obj2;
};