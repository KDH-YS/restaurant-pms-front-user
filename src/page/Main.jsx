import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from "../component/header"
import { Review } from "../page/Review"
import { MyReview } from "../page/MyReview"
import { ShopReview } from "../page/ShopReview"

export function Main() {
  return(
    <>
      <BrowserRouter>
        <Header></Header>
        <Routes>
          <Route path="/review" element={<Review/>}></Route>
          <Route path="/review/myreview" element={<MyReview/>}></Route>
          <Route path="/review/shopreview" element={<ShopReview/>}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default Main;