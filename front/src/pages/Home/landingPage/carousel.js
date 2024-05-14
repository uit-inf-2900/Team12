import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Impimg from '../../../images/huggingYarn.png';



const Carousel = () =>{


    const data = [
        {
          name: `Sera Elstad`,
          img: Impimg,
          review: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`
        },
        {
          name: `Skjalg Slubowski`,
          img: Impimg,
          review: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`
        },
        {
          name: `Emilie Steen`,
          img: Impimg,
          review: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`
        },
        {
          name: `Marie Alette Stenhaug`,
          img: Impimg,
          review: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`
        },
        {
          name: `Eline D Wito`,
          img: Impimg,
          review: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`
        },
        
      ];
      
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1
      };

    return (
        <div className='w-3/4 m-auto'>
          <div className="mt-20">
          <Slider {...settings}>
            {data.map((d) => (
              <div key={d.name} className="bg-white h-[500px] text-black rounded-xl">
                <div className='h-56 bg-indigo-500 flex justify-center items-center rounded-t-xl'>
                  <img src={d.img} />
                </div>
    
                <div className="flex flex-col items-center justify-center gap-4 p-4">
                  <p className="text-xl font-semibold">{d.name}</p>
                  <p className="text-center">{d.review}</p>
                  
                </div>
              </div>
            ))}
          </Slider>
          </div>
          
        </div>
      );

      





};



export default Carousel;