var quiz;

function showResults() {
    if (quiz.checkAnswers()) {
        var quizScorePercent = quiz.result.scorePercentFormatted;
        var quizResultElement = document.getElementById('quiz-result');
        quizResultElement.style.display = 'block';
        document.getElementById('quiz-score').innerHTML = quiz.result.score.toString();
        document.getElementById('quiz-max-score').innerHTML = quiz.result.totalQuestions.toString();
        document.getElementById('quiz-percent').innerHTML = quizScorePercent.toString();

        // Change background colour of results div according to score percent
        if (quizScorePercent >= 75) quizResultElement.style.backgroundColor = '#4caf50';
        else if (quizScorePercent >= 50) quizResultElement.style.backgroundColor = '#ffc107';
        else if (quizScorePercent >= 25) quizResultElement.style.backgroundColor = '#ff9800';
        else if (quizScorePercent >= 0) quizResultElement.style.backgroundColor = '#f44336';

        quiz.highlightResults(handleAnswers);
    }
}

/** Callback for Quiz.highlightResults. Highlights the correct answers of incorrectly answered questions */
function handleAnswers(question, no, correct) {
    if (!correct) {
        var answers = question.getElementsByTagName('input');
        for (var i = 0; i < answers.length; i++) {
            switch (answers[i].type) {
                case "checkbox":
                case "radio":
                    if (quiz.answers[no].indexOf(answers[i].value) > -1) {
                        answers[i].parentNode.classList.add(quiz.Classes.CORRECT);
                    }
                    break;
                default:
                    var correctAnswer = document.createElement('span');
                    correctAnswer.classList.add(quiz.Classes.CORRECT);
                    correctAnswer.classList.add(quiz.Classes.TEMP);
                    correctAnswer.innerHTML = quiz.answers[no];
                    correctAnswer.style.marginLeft = '10px';
                    answers[i].parentNode.insertBefore(correctAnswer, answers[i].nextSibling);
            }
        }
    }
}

window.onload = function() {
    quiz = new Quiz('quiz', [
        '42',
        'b',
        ['b', 'c', 'd']
    ]);
};