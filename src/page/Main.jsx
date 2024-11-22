import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from "../components/Header"
import { Header2 } from "../components/header2"
import { Footer } from "../components/Footer"
import { Review } from "../page/Review"
import { MyReview } from "../page/MyReview"
import { ShopReview } from "../page/ShopReview"
import { ReviewForm } from "../page/reviewForm"

export function Main() {
  return(
    <>
      <BrowserRouter>
        <Header2></Header2>
        <Header></Header>
        <Routes>
          <Route path="/review" element={<Review/>}></Route>
          <Route path="/review/myreview" element={<MyReview/>}></Route>
          <Route path="/review/shopreview" element={<ShopReview/>}></Route>
          <Route path="/review/reviewform" element={<ReviewForm/>}></Route>
        </Routes>
        <Footer></Footer>
      </BrowserRouter>
    </>
  )
}

export default Main;