import { useEffect } from 'react';
import './App.css';
import Clock from "./Clock";

function App(): JSX.Element {
    useEffect(() => {
        const script = document.createElement('script');

        script.src = "https://cdn.freecodecamp.org/testable-projects-fcc/v1/bundle.js";
        script.async = true;

        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        }
    }, [])

    useEffect(() => {
        const script = document.createElement('script');

        script.src = "https://kit.fontawesome.com/9f760185e4.js";
        script.async = true;
        script.crossOrigin = "anonymous";

        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        }
    }, [])

    return (
        <div className="App">
            <Clock />
            <header>25 + 5 Clock</header>
        </div>
    );
}

export default App;
