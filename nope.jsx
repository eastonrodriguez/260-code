import { NavLink, useNavigate } from 'react-router-dom';
import React, { useState,  useEffect } from 'react';
import './styles.css';



export function Quiz() {
  const [answeredQuestions, setAnsweredQuestions] = useState({ q1: false, q2: false, q3: false, q4: false, q5: false, q6: false, q7: false, q8: false, q9: false, q10: false });
  const [showInfo1, setShowInfo1] = useState(false);
  const [showInfo2, setShowInfo2] = useState(false);
  const [showInfo3, setShowInfo3] = useState(false);
  const [showInfo4, setShowInfo4] = useState(false);
  const [showInfo5, setShowInfo5] = useState(false);
  const [showInfo6, setShowInfo6] = useState(false);
  const [showInfo7, setShowInfo7] = useState(false);
  const [showInfo8, setShowInfo8] = useState(false);
  const [showInfo9, setShowInfo9] = useState(false);
  const [showInfo10, setShowInfo10] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [shareMessage, setShareMessage] = useState("");
  const [liveScores, setLiveScores] = useState([]);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [socket, setSocket] = useState(null);
  const [sharedMessage, setSharedMessage] = useState(null);
  const [showShareMessage, setShowShareMessage] = useState(false);
  const [quizKey, setQuizKey] = useState(0);
  const nav = useNavigate();
  const [percentile, setPercentile] = useState(null);



useEffect(() => {
    if (!localStorage.getItem("buttonClicks")) {
        localStorage.setItem("buttonClicks", JSON.stringify({ button51: 0, button52: 0 }));
    }
    const storedClicks = JSON.parse(localStorage.getItem("buttonClicks"));
    setCorrectCount(storedClicks.button51);
    setIncorrectCount(storedClicks.button52);
}, [quizKey]);

const handleButtonClick = async (questionKey, buttonType) => {
  if (answeredQuestions[questionKey]) return; 
  const storedClicks = JSON.parse(localStorage.getItem("buttonClicks")) || { button51: 0, button52: 0 };
  storedClicks[buttonType] += 1;
  localStorage.setItem("buttonClicks", JSON.stringify(storedClicks));
  setCorrectCount(storedClicks.button51);
  setIncorrectCount(storedClicks.button52);
  setAnsweredQuestions(prev => ({ ...prev, [questionKey]: true }));
  if (questionKey === "q1") setShowInfo1(true);
  if (questionKey === "q2") setShowInfo2(true);
  if (questionKey === "q3") setShowInfo3(true);
  if (questionKey === "q4") setShowInfo4(true);
  if (questionKey === "q5") setShowInfo5(true);
  if (questionKey === "q6") setShowInfo6(true);
  if (questionKey === "q7") setShowInfo7(true);
  if (questionKey === "q8") setShowInfo8(true);
  if (questionKey === "q9") setShowInfo9(true);
  if (questionKey === "q10") setShowInfo10(true);
};


const resetQuiz = async () => {
  const storedClicks = JSON.parse(localStorage.getItem("buttonClicks")) || { button51: 0, button52: 0 };
    const totalAttempts = Object.values(answeredQuestions).filter(Boolean).length;
    if (totalAttempts > 0) {
        try {
            const response = await fetch("/api/nope", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    correctCount: storedClicks.button51,
                    totalAttempts: totalAttempts
                })
            });
            const data = await response.json();
            if (data.percentile !== undefined) {
                setPercentile(data.percentile); 
            }
        } catch (error) {
            console.error("Error saving score:", error);
        }
    }
  };
  const localReact= () => {
  localStorage.setItem("buttonClicks", JSON.stringify({ button51: 0, button52: 0 }));
        setCorrectCount(0);
        setIncorrectCount(0);
        setAnsweredQuestions({ q1: false, q2: false, q3: false, q4: false, q5: false, q6: false, q7: false, q8: false, q9: false, q10: false });
        setShowInfo1(false);
        setShowInfo2(false);
        setShowInfo3(false);
        setShowInfo4(false);
        setShowInfo5(false);
        setShowInfo6(false);
        setShowInfo7(false);
        setShowInfo8(false);
        setShowInfo9(false);
        setShowInfo10(false);
        setQuizKey(prevKey => prevKey + 1);
};

const totalAttempts = Object.values(answeredQuestions).filter(Boolean).length;
useEffect(() => {
  const newSocket = new WebSocket("ws://localhost:4000");
  setSocket(newSocket);

  newSocket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.type === "sharedScore") {
        setSharedMessage(data.score);
        setTimeout(() => setSharedMessage(null), 7000);  
      }
    } catch (error) {
      console.error("Error parsing WebSocket message:", error);
    }
  };

  return () => newSocket.close(); 
}, []);
const shareScore = () => {
  const message = `I scored ${correctCount} out of ${totalAttempts} in the Weird Zoo Quiz! ${
    percentile !== null ? `I'm in the top ${percentile}%!` : ""
  } Can you beat my score? #WeirdZooQuiz`;

  if (navigator.clipboard) {
    navigator.clipboard.writeText(message)
      .then(() => alert("Score copied to clipboard! Share it with your friends."))
      .catch(err => console.error("Failed to copy:", err));
  }

  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ type: "sharedScore", score: message }));
  }
};
    return (
        <div>
          <header className="title">
                <h1>Take The Weird Zoo Quiz!</h1>
                <h3>Can you Guess These Animals Names?</h3>
            </header>
        <main>
          <section className="container">
          <div className="question-section">
            <img className="question-image" width="560" height="315" src="/Monkey.jpeg" alt="Monkey" />
            <div className="button-grid">
              <button className="button-52" type="button" onClick={() => {handleButtonClick("q1", "button52");resetQuiz()}}>Blue Tibetan Macaque</button>
              <button className="button-52" type="button" onClick={() => {handleButtonClick("q1", "button52");resetQuiz()}}>Na’vi Marmoset</button>
              <button className="button-51" type="button" onClick={() => {handleButtonClick("q1", "button51");resetQuiz()}}>Golden Snub Nosed Monkey</button>
              <button className="button-52" type="button" onClick={() => {handleButtonClick("q1", "button52");resetQuiz()}}>Nepali Sacred Langur</button>
            </div>
            </div>
            <h2>After the person pushes any button a box will apear below them that will say what the correct answer is and what percent of people got the answer right. After that there will be a short bio about the animal along with a video or voice recording about it and a link to its wiki page as seen below</h2>
            {showInfo1 && (
            <div className="info-box">
              <div>The correct answer's Golden Snub Nosed Monkey! <span id="percentile1"></span>% got this answer right</div> 
              <div><span className="slanted">Rhinopithecus roxellana</span> are endemic to the mountain forests in the heart of China. They can live in elevations over 11,000 feet above sea level eating mostly leaves and fruit and have complex social units led by an alpha male. See how they survive in the harsh mountain winters in the video below and also <a href="https://en.wikipedia.org/wiki/Golden_snub-nosed_monkey">Learn more here!</a></div>
              <iframe width="336" height="189" src="https://www.youtube.com/embed/rVZqNKFM_sc?si=3Zirw7-SGnFUY-w4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
            </div>
            )}
           </section>
           <section className="container">
           <div className="question-section">
      <img className="question-image" width="560" height="315" src="/Armadillo.jpeg" alt="Armadillo"/>
      <div className="button-grid">
        <button className="button-52" type="button" onClick={() => {handleButtonClick("q2", "button52");resetQuiz()}}>Tailless Pink Pangolin</button>
        <button className="button-52" type="button" onClick={() => {handleButtonClick("q2", "button52");resetQuiz()}}>Pichi</button>
        <button className="button-52" type="button" onClick={() => {handleButtonClick("q2", "button52");resetQuiz()}}>Strawberry Sandshrew</button>
        <button className="button-51" type="button" onClick={() => {handleButtonClick("q2", "button51");resetQuiz()}}>Pink Fairy Armadillo</button>
      </div>
      </div>
      {showInfo2 && (
      <div className="info-box">
        <div>The correct answer's Pink Fairy Armadillo! <span id="percentile2"></span>% got this answer right</div> 
        <div><span className="slanted">Chlamyphorus truncatus</span> is the smallest species of Armadillo in the world endemic to the deserts and scrub lands of Central Argentina. Their diet consists mostly of insects and they are very skilled diggers which comes in handy when they face predators. You can see them digging in the video below and also <a href="https://en.wikipedia.org/wiki/Pink_fairy_armadillo">Learn more here!</a></div>
        <iframe width="336" height="189" src="https://www.youtube.com/embed/xlcuOwzqOGs?si=ByGVOnOr5NtRbDK2" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
      </div>
      )}
    </section>
    <section className="container">
    <div className="question-section">
        <img className="question-image" width="560" height="315" src="/Echidna.jpg" alt="Echidna"/>
        <div className="button-grid">
          <button className="button-52" type="button" onClick={() => {handleButtonClick("q3", "button52");resetQuiz()}}>Tropical Long-Nosed Hedgehog</button>
          <button className="button-51" type="button" onClick={() => {handleButtonClick("q3", "button51");resetQuiz()}}>Eastern Long Beaked Echidna</button>
          <button className="button-52" type="button" onClick={() => {handleButtonClick("q3", "button52");resetQuiz()}}>Spiked Ecuadorian Anteater</button>
          <button className="button-52" type="button" onClick={() => {handleButtonClick("q3", "button52");resetQuiz()}}>Snuffleupagus</button>
        </div>
        </div>
        {showInfo3 && (
        <div className="info-box">
          <div>The correct answer's Eastern Long Beaked Echidna! <span id="percentile3"></span>% got this answer right</div>
          <div><span className="slanted">Zaglossus bartoni</span> is native to the jungles of Papua New Guinea. Like their smaller and cuter <a href="https://en.wikipedia.org/wiki/Short-beaked_echidna">Australian cousins</a> they are Monotremes meaning they are mammals that lay eggs and are 1 of only five species that do this. They use their long beaked snouts to dig underground searching for worms or insects. You can see them hunting in the video below and also <a href="https://en.wikipedia.org/wiki/Eastern_long-beaked_echidna">Learn more here!</a></div>
          <iframe width="336" height="189" src="https://www.youtube.com/embed/rzLJT0rxJhw?si=hCpPGx0lM5c6jrFw&amp;start=18" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
        </div>
        )}
    </section>
    <section className="container">
    <div className="question-section">
      <img className="question-image" width="560" height="315" src="/Bat.jpg" alt="Bat"/>
      <div className="button-grid">
        <button className="button-52" type="button" onClick={() => {handleButtonClick("q4", "button52");resetQuiz()}}>Cockroach Bat</button>
        <button className="button-52" type="button" onClick={() => {handleButtonClick("q4", "button52");resetQuiz()}}>Giant Congolese Fruit Bat</button>
        <button className="button-51" type="button" onClick={() => {handleButtonClick("q4", "button51");resetQuiz()}}>Hammer-Headed Bat</button>
        <button className="button-52" type="button" onClick={() => {handleButtonClick("q4", "button52");resetQuiz()}}>Bibundi Bat</button>
      </div>
      </div>
      {showInfo4 && (
      <div className="info-box">
        <div>The correct answer's Hammer-Headed Bat! <span id="percentile4"></span>% got this answer right</div>
        <div><span className="slanted">Hypsignathus monstrosus</span> are very common bats found all across Western and Central Africa. They are one of the largest bat species in the world with a wingspan of about 1 meter in length. Their diet consists entirely of fruit and unlike insect eating bats their face irregularities have nothing to do with echolocation. Only the males have these peculiar facial features and they are used to create a mating call to attract females. You can here the call below and <a href="https://en.wikipedia.org/wiki/Hammer-headed_bat">Learn more here!</a></div>
        <audio controls> <source src="/Brigham Young University 2.m4a" type="audio/mp4"></source></audio>
      </div>
      )}
    </section>
    <section className="container">
    <div className="question-section">
        <img className="question-image" width="560" height="315" src="/Coendou.jpg" alt="Porcupine"/>
        <div className="button-grid">
          <button className="button-51" type="button" onClick={() => {handleButtonClick("q5", "button51");resetQuiz()}}>Coendous</button>
          <button className="button-52" type="button" onClick={() => {handleButtonClick("q5", "button52");resetQuiz()}}>Malayan Hystrix</button>
          <button className="button-52" type="button" onClick={() => {handleButtonClick("q5", "button52");resetQuiz()}}>Quilled 4 Toed Sloth</button>
          <button className="button-52" type="button" onClick={() => {handleButtonClick("q5", "button52");resetQuiz()}}>Pig-Nosed Porcupine</button>
        </div>
        </div>
        {showInfo5 && (
        <div className="info-box">
          <div>The correct answer's Coendous! <span id="percentile5"></span>% got this answer right</div>
          <div><span className="slanted">Coendou prehensilis</span> is also known as the Brazilian Porcupine or the Prehensiled-Tailed Porcupine and is found across South America and use their long tails to hang over tree branches where they live most of their lives. See a fun interaction with them below and <a href="https://en.wikipedia.org/wiki/Brazilian_porcupine">Learn more here!</a></div>
          <iframe width="336" height="189" src="https://www.youtube.com/embed/Xz3btMhdQ6Y?si=8W5YJYoLIpfeYcSS&amp;start=235" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
        </div>
        )}
    </section>
    <section className="container">
    <div className="question-section">
        <img className="question-image" width="560" height="315" src="/Deer.jpg" alt="Deer"/>
        <div className="button-grid">
          <button className="button-51" type="button" onClick={() => {handleButtonClick("q6", "button51");resetQuiz()}}>Tufted Deer</button>
          <button className="button-52" type="button" onClick={() => {handleButtonClick("q6", "button52");resetQuiz()}}>Cambodian Muntjac</button>
          <button className="button-52" type="button" onClick={() => {handleButtonClick("q6", "button52");resetQuiz()}}>Vampire Puku</button>
          <button className="button-52" type="button" onClick={() => {handleButtonClick("q6", "button52");resetQuiz()}}>Fanged Dwarf Brocket</button>
        </div>
        </div>
        {showInfo6 && (
        <div className="info-box">
          <div>The correct answer's Tufted Deer! <span id="percentile6"></span>% got this answer right</div>
          <div><span className="slanted">Elaphodus cephalophus</span> is a small species of deer found in the forests of Southern China and Northern Burma. They are named after their "tuft" of black hair on the top of their heads that hide their small horns. Their most prominant feature though is the protruding fangs only found on males. The males use these fangs to both protect their territory and attract mates. You can see tufted deer in captivity below and also <a href="https://en.wikipedia.org/wiki/Tufted_deer">Learn more here!</a></div>
          <iframe width="336" height="189" src="https://www.youtube.com/embed/A6eQiZH_syI?si=tfrYBzSWWdQVMXNi&amp;start=6" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
        </div> 
        )}
    </section>
    <section className="container">
    <div className="question-section">
      <img className="question-image" width="560" height="315" src="/Cat.jpeg" alt="Cat"/>
      <div className="button-grid">
        <button className="button-52" type="button" onClick={() => {handleButtonClick("q7", "button52");resetQuiz()}}>Zadjda</button>
        <button className="button-51" type="button" onClick={() => {handleButtonClick("q7", "button51");resetQuiz()}}>Manul</button>
        <button className="button-52" type="button" onClick={() => {handleButtonClick("q7", "button52");resetQuiz()}}>Waffles McCuddlefluff</button>
        <button className="button-52" type="button" onClick={() => {handleButtonClick("q7", "button52");resetQuiz()}}>Shilüüs</button>
      </div>
      </div>
      {showInfo7 && (
      <div className="info-box">
        <div>The correct answer's Manul! <span id="percentile7"></span>% got this answer right</div>
        <div><span className="slanted">Otocolobus manul</span> are small wild cats found across Northern and Central Asia from Mongolia to Iran. They have the densest fur coat of any cat species and hunt mostly small rodents. You can see them hunt below and also <a href="https://en.wikipedia.org/wiki/Pallas%27s_cat">Learn more here!</a></div>
        <iframe width="336" height="189" src="https://www.youtube.com/embed/kgrV3_g9rYY?si=xk32YZ4yA67ORzTN" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
      </div>
      )}
    </section>
    <section className="container">
    <div className="question-section">
        <img className="question-image" width="560" height="315" src="/Tenrec.webp" alt="Tenrec"/>
        <div className="button-grid">
          <button className="button-52" type="button" onClick={() => {handleButtonClick("q8", "button52");resetQuiz()}}>Pygmy Lemon Lemur</button>
          <button className="button-52" type="button" onClick={() => {handleButtonClick("q8", "button52");resetQuiz()}}>Spiked Bumblebee Civet</button>
          <button className="button-52" type="button" onClick={() => {handleButtonClick("q8", "button52");resetQuiz()}}>Punk-Rock Porcupine</button>
          <button className="button-51" type="button" onClick={() => {handleButtonClick("q8", "button51");resetQuiz()}}>Lowland Streaked Tenrec</button>
        </div>
        </div>
        {showInfo8 && (
        <div className="info-box">
          <div>The correct answer's Lowland Streaked Tenrec! <span id="percentile8"></span>% got this answer right</div>
          <div><span className="slanted">Hemicentetes semispinosus</span> is one of 36 species of <a href="https://en.wikipedia.org/wiki/Tenrec">tenrec</a> endemic to Madagascar. They are not rodents at all and in fact are closer relatives to elaphants and manatees. They use their spines not only for protection from predators such as birds or <a href="https://en.wikipedia.org/wiki/Fossa_(animal)">Fossa</a> but also to communicate. They rub their small quills together to make a clicking sound similar to the chirps of grasshoppers. They are the only species of mammal to make this sort of sound known as <a href="https://en.wikipedia.org/wiki/Stridulation">stridulation</a>. You can see them stridulating below and also <a href="https://en.wikipedia.org/wiki/Lowland_streaked_tenrec">Learn more here!</a></div>
          <iframe width="336" height="189" src="https://www.youtube.com/embed/W9kJKu4cpXM?si=rUt8mhoGiAKH05mm" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
        </div>
        )}
    </section>
    <section className="container">
    <div className="question-section">
        <img className="question-image" width="560" height="315" src="/Quoll.webp" alt="Quoll"/>
        <div className="button-grid">
          <button className="button-52" type="button" onClick={() => {handleButtonClick("q9", "button52"); resetQuiz()}}>Tasmanian Angel</button>
          <button className="button-52" type="button" onClick={() => {handleButtonClick("q9", "button52");resetQuiz()}}>White-Speckled Ground Squirrel</button>
          <button className="button-51" type="button" onClick={() => {handleButtonClick("q9", "button51");resetQuiz()}}>Eastern Quoll</button>
          <button className="button-52" type="button" onClick={() => {handleButtonClick("q9", "button52");resetQuiz()}}>Pīwakawaka</button>
        </div>
        </div>
        {showInfo9 && (
        <div className="info-box">
          <div>The correct answer's Eastern Quoll! <span id="percentile9"></span>% got this answer right</div>
          <div><span className="slanted">Dasyurus viverrinus</span> are small marsupials that where once found all across Australia. They come in grayish tan coats and the jet black seen above but their iconic white spots are found on all forms from birth. With the introduction of foxes and weizels in mainland Australia the species soon became extinct in that area and can now be only found on the island of Tasmania where they cohabitate with their feisty cousins the <a href="https://en.wikipedia.org/wiki/Tasmanian_devil">Tasmainan Devils</a>. You can see efforts to reintroduce them to mainland Austraia below and also <a href="https://en.wikipedia.org/wiki/Eastern_quoll">Learn more here!</a></div>
          <iframe width="336" height="189" src="https://www.youtube.com/embed/ZybAdUiXng0?si=M71Ns7UYdW9D-BQL" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
        </div>
        )}
    </section>
    <section className="container">
    <div className="question-section">
        <img className="question-image" width="560" height="315" src="/Binturong.jpg" alt="CatBear"/>
        <div className="button-grid">
          <button className="button-51" type="button" onClick={() => {handleButtonClick("q10", "button51");resetQuiz()}}>Binturong</button>
          <button className="button-52" type="button" onClick={() => {handleButtonClick("q10", "button52");resetQuiz()}}>Indonesian Cat-Bear</button>
          <button className="button-52" type="button" onClick={() => {handleButtonClick("q10", "button52");resetQuiz()}}>Hla Khaing</button>
          <button className="button-52" type="button" onClick={() => {handleButtonClick("q10", "button52");resetQuiz()}}>Raharjo</button>
        </div>
        </div>
        {showInfo10 && (
        <div className="info-box">
          <div>The correct answer's Binturong! <span id="percentile10"></span>% got this answer right</div>
          <div><span className="slanted">Arctictis binturong</span> also know as the Bearcat are not closely related to cats or bears but are in fact closely related to <a href="https://en.wikipedia.org/wiki/Civet">civets</a>. They live across the jungles of Indonesia and Southeast Asia and use their enormous tails as a fifth limb to hang across trees. They are omnivors that will eat anything from fruit to small birds. They also are quite infamous for having pee that smells exactly like movie popcorn. You can see a fun interaction with them below and also <a href="https://en.wikipedia.org/wiki/Binturong">Learn more here!</a></div>
          <iframe width="336" height="189" src="https://www.youtube.com/embed/8VIJ8IJgiZ0?si=7YQ5RaS3s6USRU2n" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
        </div>
        )}
    </section>
    </main>
<footer className="container">
      <h2>
        <a href="https://github.com/eastonrodriguez/260-code.git">GitHub Link</a>
      </h2>
      <h2>
        At the end of the quiz you will see how many of the answers you got correct as well as how
        well you did compared to other people. Then you will be able to either sign out or try again.
      </h2>
      <div className="info-box">
        <div>Good job! You got {correctCount} out of {totalAttempts}, {percentile !== null ? ` which makes you in the ${percentile}% percentile!` : " calculating percentile..."}</div>
        {sharedMessage && (
      <div className="shared-score">
        <strong>{sharedMessage}</strong>
      </div>
    )}

    <button className="button-62" type="button" onClick={shareScore}>
      Share Score
    </button>
        <NavLink to="/nope">
          <button className="button-62" type="button" onClick={localReact}>
            Retry
          </button>
        </NavLink>
       
            <button className="button-62" type="button" onClick={()=>nav('/')}>
              Logout
            </button>
      </div>
    </footer>
    </div>        
    );
  }
