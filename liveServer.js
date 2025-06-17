const ctx = document.getElementById('priceChart')

const arr = JSON.parse(localStorage.getItem("arrayOfCoins") || "[]");

if (arr.length === 0) {
    alert("No currencies selected");
}


function generateColors(ids) {
    return ids.map((_, i) => `hsl(${(360 / ids.length) * i}, 70%, 60%)`);
}

const colors = generateColors(arr);

const datasets = arr.map((coinId, index) => ({
    label: coinId,
    data: [],
    borderColor: colors[index],
    backgroundColor: colors[index],
    fill: false
}))

const labels = []

const chart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: labels,
        datasets: datasets
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: 'top'
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'hour'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'value (USD)'
                },
                beginAtZero: false
            }
        }
    }
});

async function fetchAndUpdate() {
    try {
        const ids = arr.join(",");
        const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`);
        const data = await res.json();

        const timeLabel = new Date().toLocaleTimeString();
        labels.push(timeLabel)


        arr.forEach((coinId, index) => {
            const price = data[coinId]?.usd || 0;
            chart.data.datasets[index].data.push(price);
        });

        chart.update();
    } catch (error) {
        console.error(error);
    }
}


fetchAndUpdate();
setInterval(fetchAndUpdate, 15000);
