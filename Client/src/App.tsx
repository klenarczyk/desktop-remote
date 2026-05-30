import { RemoteApi } from "./api";

function App() {
    return (
        <div>
            <h2>Media</h2>
            <div>
                <button onClick={() => RemoteApi.media.prev()}>Prev</button>
                <button onClick={() => RemoteApi.media.toggle()}>
                    Play/Pause
                </button>
                <button onClick={() => RemoteApi.media.next()}>Next</button>
            </div>

            <h2>Volume</h2>
            <div>
                <button onClick={() => RemoteApi.audio.down()}>
                    Volume Down
                </button>
                <button onClick={() => RemoteApi.audio.mute()}>Mute</button>
                <button onClick={() => RemoteApi.audio.up()}>Volume Up</button>
            </div>

            <h2>Mouse</h2>
            <div>
                <button onClick={() => RemoteApi.mouse.move(0, -50)}>Up</button>
                <button onClick={() => RemoteApi.mouse.move(0, 50)}>
                    Down
                </button>
                <button onClick={() => RemoteApi.mouse.move(-50, 0)}>
                    Left
                </button>
                <button onClick={() => RemoteApi.mouse.move(50, 0)}>
                    Right
                </button>
                <button onClick={() => RemoteApi.mouse.click()}>Click</button>
            </div>

            <h2>System</h2>
            <div>
                <button onClick={() => RemoteApi.system.turnOff()}>
                    Turn Off
                </button>
            </div>
        </div>
    );
}

export default App;
