
import Navbar from "../components/Navbar"
import ProductGrid from "../components/ProductGrid"


const Home = () => {

  
    return(
        <>
            <Navbar />
           
                <section className="max-w-[1000px] mx-auto flex ">
                    <ProductGrid />
                </section>
         
        </>

    )
}

export default Home