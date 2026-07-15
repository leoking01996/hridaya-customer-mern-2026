import { useEffect, useState } from "react";
import Preloader from "@/components/Preloader";
import Navigation from "@/components/nav/Navigation";
import VideoHero from "@/components/VideoHero";
import ProductCarousel from "@/components/ProductCarousel";
import candle1 from "@/assets/candle-1.jpg";
import candle2 from "@/assets/candle-2.jpg";
import candle3 from "@/assets/candle-3.jpg";
import candle4 from "@/assets/candle-4.jpg";
import { toast } from "react-toastify";

interface Product {
  _id: any;
  product_id: any;
  name: any;
  type: any;
  short_description: any;
  price: any;
  image: any;
}
function Main_body() {

   const [products, setProducts] = useState<Product[] >([]);
 
 
 
 useEffect(() => {
 fetchProduct();
  }, []);
      const fetchProduct = async () => {
      try {
       
    
    
        const res = await fetch(
          `https://hridaya-customer-backend-production.up.railway.app/api/auth/products`
        );
    
        const data = await res.json();
        console.log("productssss:", data.data);
setProducts(data.data)
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };



    const product_list =products.map((item) => ({
  id: item.product_id,
  name: item.name,
  price: `$${item.price}`,
  image: item.image,
  description: item.short_description,
}));

 const featuredProducts = product_list;
 const bestSellers = product_list;
 const seasonalCollection = product_list;
 
    return (
        <main>
            <VideoHero />

            {/* Featured Collection */}
           <ProductCarousel
  title="Featured Collection"
  subtitle="Handpicked Favorites"
  products={featuredProducts}
/>

            {/* About Section */}
            <section className="py-20 px-4 bg-secondary/30">
                <div className="container mx-auto max-w-4xl text-center space-y-6 animate-slide-up">
                    <h2 className="text-4xl md:text-5xl font-light tracking-tight">
                        Crafted with Intention
                    </h2>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        Each Hridaya candle is hand-poured using premium soy wax, natural essential oils,
                        and cotton wicks. We believe in sustainable practices and creating products that
                        honor both the earth and your sacred space.
                    </p>
                </div>
            </section>

            {/* Best Sellers */}
            <ProductCarousel
                title="Best Sellers"
                subtitle="Customer Favorites"
                products={bestSellers}
            />

            {/* Seasonal Collection */}
            <section className="bg-accent/5">
                <ProductCarousel
                    title="Seasonal Collection"
                    subtitle="Limited Edition"
                    products={seasonalCollection}
                />
            </section>


        </main>
    )
}

export default Main_body