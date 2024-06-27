// select dom elements
const matchContainer = document.querySelector(".all-matches");
const addMatchBtn = document.querySelector(".lws-addMatch");
const resetBtn = document.querySelector(".lws-reset");

// action identifiers
const INCREMENT = "incrementScore";
const DECREMENT = "decrementScore";
const RESET = "resetScore";
const ADD_MATCH = "addMatch";

// action creators
const increment = (value) => {
    return {
        type: INCREMENT,
        payload: value,
    };
};

const decrement = (value) => {
    return {
        type: DECREMENT,
        payload: value,
    };
};

const addMatch = () => {
    return {
        type: ADD_MATCH,
    };
};

const resetMatch = () => {
    return {
        type: RESET
    };
};

// initial state
const initialState = [
    {
        id: 1,
        score: 0
    }
];

// create reducer function
function matchReducer(state = initialState, action) {
    if (action.type === INCREMENT) {
        const newMatch = state.map(item => {
            if (item.id === action.payload.id) {
                return { ...item, score: item.score + Number(action.payload.value) }
            }
            else {
                return item;
            }
        });

        return newMatch;
    } else if (action.type === DECREMENT) {
        const newMatch = state.map(item => {
            if (item.id === action.payload.id) {
                if (item.score >= Number(action.payload.value)) {
                    return { ...item, score: item.score - Number(action.payload.value) }
                } else {
                    return { ...item, score: 0 }
                }
            }
            else {
                return item;
            }
        });

        return newMatch;
    } else if (action.type === ADD_MATCH) {
        const maxId = state.reduce((prev, current) => {
            if (current.id > prev) {
                return current.id
            }
            else {
                return prev;
            }
        }, state[0].id);

        const newId = maxId + 1;

        const newMatch = {
            id: newId,
            score: 0
        };

        return [...state, newMatch];
    } else if (action.type === RESET) {
        return [...state].map(item => {
            item.score = 0
            return item;
        });
    } else {
        return state;
    }
};

// handler
const incrementHandler = (id, element) => {
    const input = element.querySelector(".lws-increment");
    const value = Number(input.value);
    if (value > 0) {
        store.dispatch(increment({ id, value }));
    }
}
const decrementHandler = (id, element) => {
    const input = element.querySelector(".lws-decrement");
    const value = Number(input.value);
    if (value > 0) {
        store.dispatch(decrement({ id, value }));
    }
}

resetBtn.addEventListener('click', () => {
    store.dispatch(resetMatch());
})

addMatchBtn.addEventListener('click', () => {
    store.dispatch(addMatch());
})

// create store
const store = Redux.createStore(matchReducer);

const render = () => {
    const state = store.getState();
    const matchesCards = state?.map((item) => {
        return `
            <div class="match">
                    <div class="wrapper">
                        <button class="lws-delete">
                            <img src="./image/delete.svg" alt="" />
                        </button>
                        <h3 class="lws-matchName">Match ${item.id}</h3>
                    </div>
                    <div class="inc-dec">
                        <form class="incrementForm" onsubmit="event.preventDefault();incrementHandler(${item.id}, this)">
                            <h4>Increment</h4>
                            <input
                                type="number"
                                name="increment"
                                class="lws-increment"
                            />
                        </form>
                        <form class="decrementForm" onsubmit="event.preventDefault();decrementHandler(${item.id}, this)">
                            <h4>Decrement</h4>
                            <input
                                type="number"
                                name="decrement"
                                class="lws-decrement"
                            />
                        </form>
                    </div>
                    <div class="numbers">
                        <h2 class="lws-single Result">${item.score}</h2>
                    </div>
                </div>
            `
    }).join("");
    matchContainer.innerHTML = matchesCards;
};

// render initial value
render();

store.subscribe(render);

