export const getDeviceId = () => {
    let id = localStorage.getItem("device_id");

    if (!id) {
        if (window.crypto && crypto.randomUUID) {
            id = crypto.randomUUID();
        } else {
            // Unsecure connection (needs a workaround)
            id = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
                /[xy]/g,
                function (c) {
                    const r = (Math.random() * 16) | 0;
                    const v = c === "x" ? r : (r & 0x3) | 0x8;
                    return v.toString(16);
                },
            );
        }

        localStorage.setItem("device_id", id);
    }

    return id;
};
