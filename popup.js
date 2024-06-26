const btn = document.querySelector('.changeColorBtn');
const colorGrid = document.querySelector('.colorGrid');
const colorValue = document.querySelector('.colorValue');

btn.addEventListener('click', async () => {
    chrome.storage.sync.get('color', ({ color }) => {
        console.log('color: ', color);
    });
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript(
        {
            target: { tabId: tab.id },
            function: pickColor,
        },
        (injectionResults) => {
            const [data] = injectionResults;
            if (data && data.result) {
                const color = data.result.sRGBHex;
                colorGrid.style.backgroundColor = color;
                colorValue.innerText = color;
                try {
                    navigator.clipboard.writeText(color);
                } catch (err) {
                    console.error('Failed to copy color to clipboard', err);
                }
            } else {
                console.error('No color picked');
            }
        }
    );
});

async function pickColor() {
    try {
        const eyeDropper = new EyeDropper();
        return await eyeDropper.open();
    } catch (err) {
        console.error('EyeDropper failed: ', err);
        return { sRGBHex: null };  // Return a fallback value
    }
}
