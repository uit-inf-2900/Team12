import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Impimg from '../../../images/huggingYarn.png';



const Carousel = () =>{


    const data = [
        {
          name: `Sera Elstad`,
          img: Impimg,
          title: "Full Stack Developer",
          review: "Sera is a third-year Cybersecurity student at UiT in Tromsø, with experience in both frontend and backend development."
        },
        {
          name: `Skjalg Slubowski`,
          img: Impimg,
          title: "Full Stack Developer",
          review: "Skjalg is a third-year Cybersecurity student at UiT in Tromsø, with experience in mainly backend development."
        },
        {
          name: `Emilie Steen`,
          img: Impimg,
          title: "Full Stack Developer",
          review: "Emilie is a third-year Cybersecurity student at UiT in Tromsø, with experience in both frontend and backend development."
        },
        {
          name: `Marie Alette Stenhaug`,
          img: Impimg,
          title: "Full Stack Developer",
          review: "Marie is a third-year Informatics student at UiT in Tromsø,  with experience in both frontend and backend development."
        },
        {
          name: `Eline D Wito`,
          img: Impimg,
          title: 'Full Stack Developer',
          review: 'Eline is a third-year Medical Informatics student at UiT in Tromsø, specializing in the intersection of healthcare and technology. With experience in both frontend and backend development'
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
    
                <div className="flex flex-col items-center justify-center gap-10 p-6">
                  <h3 className="text-xl font-semibold">{d.name}</h3>
                  <h4> {d.title}</h4>
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