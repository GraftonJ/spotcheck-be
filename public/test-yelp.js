

document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM loaded in test.js");
  console.log("before axios call");
  axios.get('yelp/')
    .then((res) => {
      console.log("--- res: ", res);
      console.log("--- res.data: ", res.data);
    })
    .catch((error) => {
      console.log("--- Error: ", error);;
    });
});
