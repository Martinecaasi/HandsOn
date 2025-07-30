const ctx = document.getElementById('statsChart').getContext('2d');

new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['Completed Events', 'Total Volunteers', 'Upcoming Events', 'Created Events'],
    datasets: [{
      label: 'Event Stats',
      data: [150, 200, 75, 350],
      backgroundColor: [
        '#cce6ff',
        '#99ccff',
        '#66b3ff',
        '#3399ff'
      ],
      borderRadius: 10,
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 50
        }
      }
    },
    animation: {
      duration: 1200, 
      easing: 'easeOutBounce', 
    }
  }
});
