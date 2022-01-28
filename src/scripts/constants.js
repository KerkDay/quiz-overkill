export default Object.freeze({
    DEFAULT_OPTIONS: {
        // Main
        title: "Quiz", 
        description: "", 
        welcomeImg: null, 

        // Quiz Options
        qSelection: "ai", // How to select a question // ai, ordered, random
        canGoBack: true, // Can a user go back after answering a question
        canSkip: true, // Can a user skip a question
        tieBreakers: "random", // How to handle tied results // random, show all
        minQuestions: 0, // Minimum amount of questions before showing results
        transition: "fade", // Transition between questions // none, fade, horizontal, vertical

        // Editor Options
        idLength: 2 // length of ID codes.
    },
    DEFAULT_CHARACTERS: [],
    DEFAULT_QUESTIONS: []
})