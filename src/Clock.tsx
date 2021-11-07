import React from "react";
import "./Clock.css";

type ClockState = {
    sessionLength: number,
    breakLength: number,
    timeLeft: number,
    running: boolean,
    session: boolean
}

class Clock extends React.Component<Record<string, never>, ClockState> {
    timer: number;
    audio: React.RefObject<HTMLAudioElement>;

    constructor(props: Record<string, never>) {
        super(props);
        this.state = {
            sessionLength: 25,
            breakLength: 5,
            timeLeft: 1500,
            running: false,
            session: true
        };
        this.timer = 0;
        this.audio = React.createRef<HTMLAudioElement>();
        this.getFormattedTime = this.getFormattedTime.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    getFormattedTime(): string {
        let formattedTimeLeft = "";
        if (Math.trunc(this.state.timeLeft / 60).toString().length === 2)
            formattedTimeLeft += Math.trunc(this.state.timeLeft / 60).toString() + ":";
        else
            formattedTimeLeft += 0 + Math.trunc(this.state.timeLeft / 60).toString() + ":";
        if ((this.state.timeLeft % 60).toString().length === 2)
            formattedTimeLeft += (this.state.timeLeft % 60).toString();
        else
            formattedTimeLeft += 0 + (this.state.timeLeft % 60).toString();
        return formattedTimeLeft;
    }

    handleClick(e: React.MouseEvent<HTMLButtonElement>): void {
        switch (e.currentTarget.id) {
            case "session-increment":
                if (this.state.sessionLength < 60)
                    this.setState({
                        sessionLength: this.state.sessionLength + 1,
                        timeLeft: (this.state.sessionLength + 1) * 60
                    });
                break;
            case "session-decrement":
                if (this.state.sessionLength > 1)
                    this.setState({
                        sessionLength: this.state.sessionLength - 1,
                        timeLeft: (this.state.sessionLength - 1) * 60
                    });
                break;
            case "break-increment":
                if (this.state.breakLength < 60) this.setState({ breakLength: this.state.breakLength + 1 });
                break;
            case "break-decrement":
                if (this.state.breakLength > 1) this.setState({ breakLength: this.state.breakLength - 1 });
                break;
            case "start_stop":
                if (this.state.running) {
                    window.clearInterval(this.timer);
                    this.setState({ running: false });
                } else {
                    this.timer = window.setInterval(() => {
                        this.setState({ timeLeft: this.state.timeLeft - 1 })
                        if (this.state.timeLeft < 0) {
                            if (this.audio.current instanceof HTMLAudioElement) this.audio.current.play();
                            if (!this.state.session) {
                                this.setState({
                                    timeLeft: this.state.sessionLength * 60,
                                    session: !this.state.session
                                });
                            } else {
                                this.setState({
                                    timeLeft: this.state.breakLength * 60,
                                    session: !this.state.session
                                });
                            }
                        }
                    }, 1000);
                    this.setState({ running: true });
                }
                break;
            case "reset":
                if (this.audio.current instanceof HTMLAudioElement) {
                    this.audio.current.pause();
                    this.audio.current.load();
                }
                if (this.timer) window.clearInterval(this.timer);
                this.setState({ sessionLength: 25, breakLength: 5, timeLeft: 1500, running: false, session: true });
                break;
        }
    }

    render(): React.ReactNode {
        return (
            <div className="Clock">
                <audio id="beep"
                       ref={this.audio}
                       src="https://freesound.org/data/previews/153/153213_2499466-lq.mp3" />
                <div id="session-wrapper">
                    <div id="session-label">Session Length</div>
                    <div id="session-length">{this.state.sessionLength}</div>
                    <button id="session-increment"
                            type="button"
                            onClick={this.handleClick}
                            disabled={this.state.running}><i className="fas fa-arrow-up" /></button>
                    <button id="session-decrement"
                            type="button"
                            onClick={this.handleClick}
                            disabled={this.state.running}><i className="fas fa-arrow-down" /></button>
                </div>
                <div id="break-wrapper">
                    <div id="break-label">Break Length</div>
                    <div id="break-length">{this.state.breakLength}</div>
                    <button id="break-increment"
                            type="button"
                            onClick={this.handleClick}
                            disabled={this.state.running}><i className="fas fa-arrow-up" /></button>
                    <button id="break-decrement"
                            type="button"
                            onClick={this.handleClick}
                            disabled={this.state.running}><i className="fas fa-arrow-down" /></button>
                </div>
                <div id="clock-wrapper">
                    <div id="timer-label">{this.state.session ? "Session" : "Break"}</div>
                    <p id="time-left">{this.getFormattedTime()}</p>
                    <button id="start_stop" type="button" onClick={this.handleClick}><i className="fas fa-play" /> / <i className="fas fa-pause" /></button>
                    <button id="reset" type="button" onClick={this.handleClick}><i className="fas fa-undo-alt" /></button>
                </div>
            </div>
        )
    }
}

export default Clock;
