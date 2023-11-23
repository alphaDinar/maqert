export const solveRatings =(ratings)=>{
  const result = Math.round(ratings.reduce((val, el) => val + parseInt(el.score), 0) / ratings.length || 0) ;
  return result;
}

export const sortByViews = (a, b) => {
  const prodA = a.views;
  const prodB = b.views;
  return prodB - prodA;
}