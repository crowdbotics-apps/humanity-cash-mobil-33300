import React, {useEffect, useState} from 'react';
import {observer} from "mobx-react-lite";
import {DndProvider, useDrop} from 'react-dnd'
import './SynthesisExplorer.css';
import {PageWeb} from "../../components"
import {useNavigate, useParams} from "react-router-dom"
import reactant from '../../assets/images/reactants.png'
import reagent from '../../assets/images/reagents.png'
import {Item} from "../../components/Item/Item"
import {ItemReagent} from "../../components/ItemReagent/Item"
import Lottie from "react-lottie"
import animation from "../../assets/svg/chemistry-animation.json"
import target from "../../assets/svg/target.json"
import {dimensionsFixArrowService, formatData, genericApiError} from "../../helpers"
import {useStores} from "../../models/root-store/root-store-context"
import {toast} from "react-toastify"


export const SynthesisExplorer: React.FC = observer(() => {
  const rootStore = useStores()
  let {id} = useParams();
  const [Loading, setLoading] = useState<boolean>(false);
  const [StartAnimation, setStartAnimation] = useState<boolean>(false)
  const [StartSecondAnimation, setStartSecondAnimation] = useState<boolean>(false)
  const [Reactants, setReactants] = useState<any>([])
  const [Reagents, setReagents] = useState<any>([])
  const [SecondReagent, setSecondReagent] = useState<any>([])
  const [FirstResultReactants, setFirstResultReactants] = useState<any>([])

  const [ResultImage, setResultImage] = useState<string>("")
  const [ReactantsBase, setReactantsBase] = useState<any>([])
  const [ReagentsBase, setReagentsBase] = useState<any>([])
  const [ProblemResult, setProblemResult] = useState<any>([])
  const [SecondProblemResult, setSecondProblemResult] = useState<any>([])
  const [width, setWidth] = useState<number>(window.innerWidth)
  const [Title, setTitle] = useState<string>('')
  const [SynthesisProblemOptions, setSynthesisProblemOptions] = useState<any[]>([])

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animation,
  };

  const targetOptions = {
    loop: true,
    autoplay: true,
    animationData: target,
  };


  const [{isOver, canDrop}, dropRef] = useDrop({
    accept: 'reactant',
    drop: (item) => setReactants((Reactants: unknown[]) => {
      return !Reactants.includes(item) ? [...Reactants, item] : Reactants;
    }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    })
  })

  const [{isFirstResultOver, canDropFirstResult}, dropFirstResultRef] = useDrop({
    accept: 'reactant',
    drop: (item) => setFirstResultReactants((FirstResultReactants: unknown[]) => {
      return !FirstResultReactants.includes(item) ? [...FirstResultReactants, item] : FirstResultReactants;
    }),
    collect: (monitor) => ({
      isFirstResultOver: monitor.isOver(),
      canDropFirstResult: monitor.canDrop()
    })
  })


  const [{isReagentsOver, canDropReagents}, dropReagentsRef] = useDrop({
    accept: 'reagent',
    drop: (item) => setReagents((Reagents: unknown[]) => {
      if (Reagents.length === 0) {
        return [...Reagents, item]
      } else {
        return Reagents
      }
    }),
    collect: (monitor) => ({
      isReagentsOver: monitor.isOver(),
      canDropReagents: monitor.canDrop()
    })
  })


  const [{isSecondReagentsOver, canDropSecondReagents}, dropSecondReagentsRef] = useDrop({
    accept: 'reagent',
    drop: (item) => setSecondReagent((SecondReagent: unknown[]) => {
      if (SecondReagent.length === 0) {
        return [...SecondReagent, item]
      } else {
        return SecondReagent
      }
    }),
    collect: (monitor) => ({
      isSecondReagentsOver: monitor.isOver(),
      canDropSecondReagents: monitor.canDrop()
    })
  })

  const handleWindowSizeChange = () => {
    setWidth(window.innerWidth);
  }


  const deleteReactant = (id: number) => {
    const reactantsArray = [...Reactants]
    const filtered = reactantsArray.filter(function (item) {
      return item.id !== id
    })
    setReactants(filtered)
  }

  const deleteReagent = (id: number) => {
    const reagentsArray = [...Reagents]
    const filtered = reagentsArray.filter(function (item) {
      return item.id !== id
    })
    setReagents(filtered)
  }

  const deleteSecondReagent = (id: number) => {
    const reagentsArray = [...SecondReagent]
    const filtered = reagentsArray.filter(function (item) {
      return item.id !== id
    })
    setSecondReagent(filtered)
  }

  const deleteFirstResultReactants = (id: number) => {
    const reagentsArray = [...FirstResultReactants]
    const filtered = reagentsArray.filter(function (item) {
      return item.id !== id
    })
    setFirstResultReactants(filtered)
  }

  const getRandomProblem = () => {
    const randomProblem = SynthesisProblemOptions[Math.floor(Math.random() * SynthesisProblemOptions.length)];
    getProblemData(randomProblem.value)
    setTitle(randomProblem.label)
    console.log(randomProblem)
  }

  const getSynthesisProblems = () => {
    rootStore.environment.api.getSynthesisProblems().then((result: any) => {
      setLoading(false)
      if (result.kind === "ok") {
        const title = result.data.results.find((res: any) => {
          return res.id === parseInt(id as string)
        })
        setTitle(title.name)
        setSynthesisProblemOptions(formatData(result.data.results))
      }
    })
  }


  const getProblemData = (id: string) => {
    setLoading(true)
    rootStore.environment.api.getProblem(parseInt(id)).then((result: any) => {
      // delay para mostrar animacion
      setTimeout(() => setLoading(false), 800)
      if (result.kind === "ok") {
        const {product, reactants, reagents} = result.data.results
        setResultImage(dimensionsFixArrowService(product.url, 150, 200))
        // Reactants
        const formatedReactants: { id: any; smiles: any; url: string; }[] = []
        reactants.map((reactant: any) => {
          const formatedReactant = {
            id: reactant.id,
            smiles: reactant.smiles,
            url: dimensionsFixArrowService(reactant.url, 100, 100),
          }
          formatedReactants.push(formatedReactant)
        })
        setReactantsBase(formatedReactants)
        // Reagents
        const formatedReagents: { id: number; text: string; url: string; }[] = []
        reagents.map((reagent: any) => {
          const formatedReagent = {
            id: reagent.id,
            text: reagent.text,
            url: dimensionsFixArrowService(reagent.url, 100, 100),
          }
          formatedReagents.push(formatedReagent)
        })
        setReagentsBase(formatedReagents)
      }
    }).catch((error: any) => {
      setLoading(false)
      genericApiError()
    })
  }

  const getProblemResult = () => {
    if (Reactants.length === 0) {
      toast.warn("Please select at least one reactant", {
        position: toast.POSITION.TOP_CENTER
      });
      return
    }
    if (Reagents.length === 0) {
      toast.warn("Please select at least one reagent", {
        position: toast.POSITION.TOP_CENTER
      });
      return
    }
    let smilesResult = ''
    Reactants.map((reactant: any) => {
      if (smilesResult !== '') {
        smilesResult += ',' + reactant.smiles
      } else {
        smilesResult += reactant.smiles
      }
    })
    setStartAnimation(true)
    rootStore.environment.api.getProblemResult(encodeURIComponent(smilesResult), Reagents[0].id).then((result: any) => {
      setStartAnimation(false)
      const formatedReactants: { id: any; smiles: any; url: string; }[] = []
      result.data.map((reactant: any) => {
        if (reactant.url) {
          const formatedReactant = {
            id: reactant.id,
            smiles: reactant.smiles,
            url: dimensionsFixArrowService(reactant.url, 100, 100),
          }
          formatedReactants.push(formatedReactant)
        } else {
          formatedReactants.push(reactant)
        }
      })
      setProblemResult(formatedReactants)
    }).catch((error: any) => {
      setStartAnimation(false)
      genericApiError()
    })
  }

  const getSecondProblemResult = () => {

    if (ProblemResult.length === 0) {
      toast.warn("Please first do the first step", {
        position: toast.POSITION.TOP_CENTER
      });
      return
    }

    if (FirstResultReactants.length === 0) {
      toast.warn("Please select at least one reactant", {
        position: toast.POSITION.TOP_CENTER
      });
      return
    }

    if (SecondReagent.length === 0) {
      toast.warn("Please select at least one reactant", {
        position: toast.POSITION.TOP_CENTER
      });
      return
    }

    let smilesResult = ''
    FirstResultReactants.map((reactant: any) => {
      if (smilesResult !== '') {
        smilesResult += ',' + reactant.smiles
      } else {
        smilesResult += reactant.smiles
      }
    })
    setStartSecondAnimation(true)
    rootStore.environment.api.getProblemResult(encodeURIComponent(smilesResult), SecondReagent[0].id).then((result: any) => {
      setStartSecondAnimation(false)
      const formatedReactants: { id: any; smiles: any; url: string; }[] = []
      result.data.map((reactant: any) => {
        if (reactant.url) {
          const formatedReactant = {
            id: reactant.id,
            smiles: reactant.smiles,
            url: dimensionsFixArrowService(reactant.url, 100, 100),
          }
          formatedReactants.push(formatedReactant)
        } else {
          formatedReactants.push(reactant)
        }
      })
      setSecondProblemResult(formatedReactants)
    }).catch((error: any) => {
      setStartSecondAnimation(false)
      genericApiError()
    })

  }

  useEffect(() => {
    if (id) {
      getProblemData(id)
      getSynthesisProblems()
    }
  }, [])


  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    }
  }, []);


  const isMobile = width <= 768;


  return (
    <PageWeb header header_title={Title} loading={Loading} left_button_header_action={getRandomProblem}>
      {/*Desktop version*/}
      {!isMobile && <div className="row mt-5">
        {/*<div className={'col-6 text-white fw-bold mb-5'}>{Title}</div>*/}
        <div className={"col-12"}>
          <div className={"card reaction-container"}>
            <div className={"card-body"}>
              <div className={"row"}>
                <div className={"col-4 d-flex"}>
                  <div
                    className={"card-blue-border me-3 p-5 text-center d-flex justify-content-center align-items-center flex-column"}
                    ref={dropRef}>
                    {Reactants.map((reactant: { id: any; name: any; image: string; smiles: string }) => {
                        return (
                          <div key={'reactant-idp-' + reactant.id} onClick={() => deleteReactant(reactant.id)}>
                            <Item extraClass={''} id={reactant.id} image={reactant.image} smiles={reactant.smiles}/>
                          </div>
                        )
                      }
                    )
                    }
                    {!isOver && !canDrop && Reactants.length === 0 && <span>Drag and drop one or more Reactants</span>}
                    {isOver && <div>Drop Here!</div>}
                    {canDrop && !isOver && <Lottie options={targetOptions} height={100} width={100}/>}
                  </div>
                  <div className={"d-flex flex-column"}>
                    <div
                      className={"card-red-border text-center d-flex flex-column justify-content-center align-items-center"}
                      ref={dropReagentsRef}>
                      {Reagents.map((reagent: { id: any; name: any; image: string; text: string }) => {
                          return (
                            <div key={'reagent-idp-' + reagent.id} onClick={() => deleteReagent(reagent.id)}>
                              <ItemReagent extraClass={''} id={reagent.id} image={reagent.image} text={reagent.text}/>
                            </div>
                          )
                        }
                      )
                      }
                      {!isReagentsOver && !canDropReagents && Reagents.length === 0 &&
                        <div className={"p-5"}>Drag and drop a Reagent</div>}
                      {isReagentsOver && Reagents.length === 0 && <div className={"p-5"}>Drop Here!</div>}
                      {!isReagentsOver && canDropReagents && Reagents.length === 0 && <div className={"p-5"}>
                        <Lottie
                          options={targetOptions}
                          height={100}
                          width={100}
                        />
                      </div>}
                    </div>
                    <svg className={"mx-auto mt-3"} width="75" height="6" viewBox="0 0 75 6" fill="none"
                         xmlns="http://www.w3.org/2000/svg">
                      <path d="M75 3L70 0.113249V5.88675L75 3ZM0 3.5H70.5V2.5H0V3.5Z" fill="#6B6A6A"/>
                    </svg>
                    <div
                      className={"start-reaction-button d-flex justify-content-center align-items-center mt-2"}
                      onClick={() => getProblemResult()}>
                      Start reaction
                    </div>
                  </div>
                </div>
                <div className={"col-4 bordered-container d-flex"}>
                  <div className={"d-flex flex-column me-3"}>
                    <div
                      className={"card-dotted-border text-center d-flex flex-column justify-content-center align-items-center"}>
                      {!StartAnimation && ProblemResult.length === 0 &&
                        <div className={'p-5'}>Intermediate Product</div>}
                      {StartAnimation && ProblemResult.length === 0 && <div><Lottie
                        options={defaultOptions}
                        height={48}
                        width={48}
                      />
                      </div>
                      }
                      {ProblemResult.map((res: any, index: number) => {
                        if (res.url) {
                          return (
                            <div key={'reactant-idp-' + index} onClick={() => deleteReactant(index)}>
                              <Item extraClass={''} id={index} image={res.url} smiles={res.smiles}/>
                            </div>
                          )
                        } else {
                          return (
                            <span style={{fontSize: 12}} className={'mx-4'}>{res.message}</span>
                          )
                        }
                      })}
                    </div>
                    <div
                      className={"card-dotted-border text-center d-flex flex-column justify-content-center align-items-center mt-3"}
                      ref={dropFirstResultRef}>
                      {FirstResultReactants.map((reactant: { id: any; name: any; image: string; smiles: string }) => {
                          return (
                            <div key={'reactant-idp-' + reactant.id}
                                 onClick={() => deleteFirstResultReactants(reactant.id)}>
                              <Item extraClass={''} id={reactant.id} image={reactant.image} smiles={reactant.smiles}/>
                            </div>
                          )
                        }
                      )
                      }
                      {!isFirstResultOver && !canDropFirstResult && FirstResultReactants.length === 0 &&
                        <div className={'p-5 '}>Extra Intermediate</div>}
                      {isFirstResultOver && <div className={'p-5'}>Drop Here!</div>}
                      {canDropFirstResult && !isFirstResultOver &&
                        <div className={'p-5'}><Lottie options={targetOptions} height={100} width={100}/></div>}
                    </div>
                  </div>
                  <div className={"d-flex flex-column"}>
                    <div
                      className={"card-red-border text-center d-flex flex-column justify-content-center align-items-center"}
                      ref={dropSecondReagentsRef}
                    >
                      {SecondReagent.map((reagent: { id: any; name: any; image: string; text: string }) => {
                          return (
                            <div key={'reagent-idp-' + reagent.id} onClick={() => deleteSecondReagent(reagent.id)}>
                              <ItemReagent extraClass={''} id={reagent.id} image={reagent.image} text={reagent.text}/>
                            </div>
                          )
                        }
                      )
                      }
                      {!isSecondReagentsOver && !canDropSecondReagents && SecondReagent.length === 0 &&
                        <div className={"p-5"}>Drag and drop a Reagent</div>}
                      {isSecondReagentsOver && SecondReagent.length === 0 && <div className={"p-5"}>Drop Here!</div>}
                      {canDropSecondReagents && !isSecondReagentsOver && SecondReagent.length === 0 &&
                        <div className={"p-5"}>
                          <Lottie
                            options={targetOptions}
                            height={100}
                            width={100}
                          />
                        </div>}
                    </div>
                    <svg className={"mx-auto mt-3"} width="75" height="6" viewBox="0 0 75 6" fill="none"
                         xmlns="http://www.w3.org/2000/svg">
                      <path d="M75 3L70 0.113249V5.88675L75 3ZM0 3.5H70.5V2.5H0V3.5Z" fill="#6B6A6A"/>
                    </svg>
                    <div
                      className={"start-reaction-button d-flex justify-content-center align-items-center mt-2"}
                      onClick={() => getSecondProblemResult()}>
                      Next reaction
                    </div>
                  </div>

                </div>
                <div className={"col-4 d-flex"}>
                  <div
                    className={"card-dotted-border text-center d-flex flex-column justify-content-center align-items-center col-6"}>
                    {/*{!StartSecondAnimation && SecondProblemResult.length === 0 && <div className={'p-5'}>Result</div>}*/}
                    {StartSecondAnimation && SecondProblemResult.length === 0 && <div className={'p-5'}><Lottie
                      options={defaultOptions}
                      height={48}
                      width={48}
                    />
                    </div>}
                    {SecondProblemResult.map((res: any) => {
                      if (res.url) {
                        return (
                          <img src={res.url} alt={""} style={{width: 100, height: 100}}/>
                        )
                      } else {
                        return (
                          <span style={{fontSize: 12}} className={'mx-4'}>{res.message}</span>
                        )
                      }
                    })}
                  </div>
                  <div
                    className={"target-product-container ms-3 d-flex flex-column align-items-center justify-content-center "}>
                    <div className={"title-result-header d-flex justify-content-center align-items-center"}>
                      Target product
                    </div>
                    <div className={"d-flex justify-content-center align-items-center"}>
                      <img
                        className={"target-product"}
                        src={ResultImage}
                        alt={""}/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={"col-12 mt-3"}>
          <div className={"row"}>
            <div className={"col-6 position-relative"}>
              <div className={"reactants-container"}>
                <div className={"reactants-title-container d-flex justify-content-center align-items-center"}>
                  Reactants available
                </div>
                <div className={"reaction-title-circle d-flex justify-content-center align-items-center"}>
                  <img src={reactant} style={{width: 60, height: 60}} alt={""}/>
                </div>
                <div className={"pt-5 ps-3 row justify-content-start align-items-start"}>
                  {ReactantsBase.map((reactant: { id: any; url: any; smiles: string }) => {
                    return (
                      <Item extraClass={''} id={reactant.id} image={reactant.url} smiles={reactant.smiles}/>
                    )
                  })}
                </div>
              </div>
            </div>
            <div className={"col-6 position-relative"}>
              <div className={"reactants-container"}>
                <div
                  className={"reactants-title-container reagent-background-color d-flex justify-content-center align-items-center"}>
                  Reagents available
                </div>
                <div className={"reaction-title-circle d-flex justify-content-center align-items-center"}>
                  <img src={reagent} style={{width: 50, height: 45}} alt={""}/>
                </div>
                <div className={"pt-5 ps-3 row justify-content-start align-items-start"}>
                  {ReagentsBase.map((reagent: { id: any; url: any; text: any; }) => <ItemReagent extraClass={''}
                                                                                                 id={reagent.id}
                                                                                                 image={reagent.url}
                                                                                                 text={reagent.text}/>)}
                </div>
              </div>
            </div>
            <div className={"col-4"}>

            </div>
          </div>
        </div>
      </div>}
      {/*Mobile version*/}
      {isMobile && <div className="row">
        {/*Selector*/}
        <div className={"col-12"}>
          <div className={"card reaction-container"}>
            <div className={"card-body"}>
              <div className={"row"}>
                <div className={"col-4 d-flex"}>
                  <div className={"card-blue-border  text-center me-3"}>
                  </div>
                  <div className={"d-flex flex-column"}>
                    <div className={"card-red-border text-center mb-2"}></div>
                    <svg width="30" height="6" viewBox="0 0 30 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M30 3L25 0.113249V5.88675L30 3ZM0 3.5H25.5V2.5H0V3.5Z" fill="#6B6A6A"/>
                    </svg>
                  </div>
                </div>
                <div className={"col-4 bordered-container d-flex"}>
                  <div className={"d-flex flex-column me-3"}>
                    <div className={"card-dotted-border text-center"}>
                    </div>
                    <div className={"card-dotted-border  text-center mt-3"}>
                    </div>
                  </div>
                  <div className={"d-flex flex-column"}>
                    <div className={"card-red-border text-center mb-2"}></div>
                    <svg width="30" height="6" viewBox="0 0 30 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M30 3L25 0.113249V5.88675L30 3ZM0 3.5H25.5V2.5H0V3.5Z" fill="#6B6A6A"/>
                    </svg>
                  </div>
                </div>
                <div className={"col-4 d-flex "}>
                  <div className={"card-dotted-border p-2 text-center col-6"}>
                  </div>
                  <div className={"target-product-container d-flex flex-column align-items-center"}>
                    <div className={"title-result-header d-flex justify-content-center align-items-center"}>
                      Target product
                    </div>
                    <div className={"d-flex justify-content-center align-items-center mt-2"}>
                      <img
                        src={ResultImage}
                        alt={""} style={{width: "auto", height: 80}}/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/*Current element selected*/}
        <div className={"col-12 mt-4"}>
          <div className={"card current-element"}>
            <div className={"card-body"}>
              <div className={"row"}>
                <div
                  className={"col-4 card-blue-border-selected p-3 text-center d-flex flex-column justify-content-center align-items-center"}
                  ref={dropRef}>
                  {Reactants.map((reactant: { id: any; name: any; image: string; smiles: string }) => {
                      return (
                        <div className={'col-2'} key={'reactant-idp-' + reactant.id}
                             onClick={() => deleteReactant(reactant.id)}>
                          <Item extraClass={'col-2'} id={reactant.id} image={reactant.image} smiles={reactant.smiles}/>
                        </div>
                      )
                    }
                  )
                  }
                  {!isOver && Reactants.length === 0 && <div>Select reactant(S)</div>}
                  {isOver && <div>Drop Here!</div>}
                </div>
                <div className={"col-4 d-flex flex-column"}>
                  <div
                    className={"card-red-border-selected p-2 text-center d-flex justify-content-center align-items-center"}
                    ref={dropReagentsRef}>
                    {Reagents.map((reagent: { id: any; name: any; image: string; text: string }) => {
                        return (
                          <div key={'reagent-idp-' + reagent.id} onClick={() => deleteReagent(reagent.id)}>
                            <ItemReagent extraClass={''} id={reagent.id} image={reagent.image} text={reagent.text}/>
                          </div>
                        )
                      }
                    )
                    }
                    {!isReagentsOver && Reagents.length === 0 && <div>Select a Reagent</div>}
                    {isReagentsOver && <div>Drop Here!</div>}
                  </div>
                  <svg className={"mx-auto mt-3"} width="75" height="6" viewBox="0 0 75 6" fill="none"
                       xmlns="http://www.w3.org/2000/svg">
                    <path d="M75 3L70 0.113249V5.88675L75 3ZM0 3.5H70.5V2.5H0V3.5Z" fill="#6B6A6A"/>
                  </svg>
                </div>
                <div
                  className={"col-4 card-blue-border p-3 text-center d-flex flex-column justify-content-center align-items-center"}>
                  {StartAnimation && <Lottie
                    options={defaultOptions}
                    height={100}
                    width={100}
                  />
                  }
                  {!StartAnimation && <>
                    <span className={"mb-auto"}>Products</span>
                    <span className={"question-mark"}>?</span>
                    <div
                      className={"start-reaction-button d-flex justify-content-center align-items-center mt-auto"}
                      onClick={() => getProblemResult()}>
                      Start reaction
                    </div>
                  </>}

                </div>
              </div>
            </div>
          </div>
        </div>
        {/*Reagent and Reactants*/}
        <div className={"col-12 mt-5"}>
          <div className={"row"}>
            <div className={"col-6"}>
              <div className={"reagent-reactant-container position-relative"}>
                <div className={"reactants-title-container d-flex justify-content-center align-items-center"}>
                  Reactants available
                </div>
                <div className={"reaction-title-circle d-flex justify-content-center align-items-center"}>
                  <img src={reactant} style={{width: 40, height: 40}} alt={""}/>
                </div>
                <div className={"pt-5 row justify-content-center"}>
                  {ReactantsBase.map((reactant: { id: any; url: any; smiles: string }) => {
                    return (
                      <Item extraClass={'col-3'} id={reactant.id} image={reactant.url} smiles={reactant.smiles}/>
                    )
                  })}
                </div>
              </div>
            </div>
            <div className={"col-6"}>
              <div className={"reagent-reactant-container position-relative"}>
                <div
                  className={"reactants-title-container reagent-background-color d-flex justify-content-center align-items-center"}>
                  Reagents available
                </div>
                <div className={"reaction-title-circle d-flex justify-content-center align-items-center"}>
                  <img src={reagent} style={{width: 40, height: 35}} alt={""}/>
                </div>
                <div className={"pt-5 row justify-content-center"}>
                  {ReagentsBase.map((reagent: { id: any; url: any; text: any; }) => <ItemReagent extraClass={'col-3'}
                                                                                                 id={reagent.id}
                                                                                                 image={reagent.url}
                                                                                                 text={reagent.text}/>)}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/*Reagent and Reactants*/}
        <span className={"text-white fw-bold mt-5"}>RESOURCES</span>
        <span className={"text-white fw-bold"}>Reaction Examples</span>
        <span className={"text-white fw-bold"}>LINKS: Aldol Chemistry | Alkenes</span>
        <span className={"text-white fw-bold"}>Aromatics Substitution</span>

      </div>}
    </PageWeb>
  );
});

export default SynthesisExplorer;
