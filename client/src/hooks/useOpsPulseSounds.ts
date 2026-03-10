import useSound from "use-sound";

export function useOpsPulseSounds() {
    const [playSuccess] = useSound("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3", { volume: 0.5 });
    const [playAlert] = useSound("https://assets.mixkit.co/active_storage/sfx/2868/2868-preview.mp3", { volume: 0.5 });
    const [playHover] = useSound("https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3", { volume: 0.2 });
    const [playWarRoom] = useSound("https://assets.mixkit.co/active_storage/sfx/2870/2870-preview.mp3", { volume: 0.4 });

    return {
        playSuccess,
        playAlert,
        playHover,
        playWarRoom
    };
}
