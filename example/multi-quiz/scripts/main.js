/**
* Try this example at https://alpsquid.github.io/quizlib
*/

/** Key value pairs using quiz element IDs and Quiz Objects.
 * For example: quizzes['quiz-1'] = [Quiz Object]
 */
var quizzes = {};

/**
 * Callback for answer buttons. The implementation for this will vary depending on your requirements.
 * In this example, the same function is being used for every quiz so we pass the ID of the quiz element and
 * retrieve the respective quiz instance from the quiz map we created in the window.onload function.
 */
function showResults(quizID) {
    // Retrieve the quiz instance for this quiz element from the map.
    var activeQuiz = quizzes[quizID];
    // Check answers and continue if all questions have been answered
    if (activeQuiz.checkAnswers()) {
        var quizScorePercent = activeQuiz.result.scorePercentFormatted; // The unformatted percentage is a decimal in range 0 - 1
        var quizResultElement = document.getElementById('quiz-result');
        // Move the quiz result element to the active quiz, placing it after the quiz title.
        var quizElement = document.getElementById(quizID);
        quizElement.insertBefore(quizResultElement, quizElement.children[1]);

        // Show the result element and add result values.
        quizResultElement.style.display = 'block';
        document.getElementById('quiz-score').innerHTML = activeQuiz.result.score.toString();
        document.getElementById('quiz-max-score').innerHTML = activeQuiz.result.totalQuestions.toString();
        document.getElementById('quiz-percent').innerHTML = quizScorePercent.toString();

        // Change background colour of results div according to score percent
        if (quizScorePercent >= 75) quizResultElement.style.backgroundColor = '#4caf50';
        else if (quizScorePercent >= 50) quizResultElement.style.backgroundColor = '#ffc107';
        else if (quizScorePercent >= 25) quizResultElement.style.backgroundColor = '#ff9800';
        else if (quizScorePercent >= 0) quizResultElement.style.backgroundColor = '#f44336';
        
        // Highlight questions according to whether they were correctly answered. The callback allows us to highlight/show the correct answer
        activeQuiz.highlightResults(handleAnswers);
    }
}

/** Callback for Quiz.highlightResults. Highlights the correct answers of incorrectly answered questions 
 * Parameters are: the quiz object, the question element, question number, correctly answered flag
 */
function handleAnswers(quiz, question, no, correct) {
    if (!correct) {
        var answers = question.getElementsByTagName('input');
        for (var i = 0; i < answers.length; i++) {
            if (answers[i].type === "checkbox" || answers[i].type === "radio"){ 
                // If the current input element is part of the correct answer, highlight it
                if (quiz.answers[no].indexOf(answers[i].value) > -1) {
                    answers[i].parentNode.classList.add(Quiz.Classes.CORRECT);
                }
            } else {
                // If the input is anything other than a checkbox or radio button, show the correct answer next to the element
                var correctAnswer = document.createElement('span');
                correctAnswer.classList.add(Quiz.Classes.CORRECT);
                correctAnswer.classList.add(Quiz.Classes.TEMP); // quiz.checkAnswers will automatically remove elements with the temp class
                correctAnswer.innerHTML = quiz.answers[no];
                correctAnswer.style.marginLeft = '10px';
                answers[i].parentNode.insertBefore(correctAnswer, answers[i].nextSibling);
            }
        }
    }
}

window.onload = function() {
    // Create quiz instances for each quiz and add them to the quizzes map.
    // The key is the ID of the quiz element, same as what we pass to the Quiz object as the first argument.
    quizzes['quiz-1'] = new Quiz('quiz-1', [
        '42',
        'b',
        ['b', 'c', 'd']
    ]);

    quizzes['quiz-2'] = new Quiz('quiz-2', [
        'b',
        'squid'
    ]);

    quizzes['quiz-3'] = new Quiz('quiz-3', [
        '4',
        'b'
    ])
};
