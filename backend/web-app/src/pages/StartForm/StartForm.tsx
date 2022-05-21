import React, {useEffect, useState} from 'react';
import {observer} from "mobx-react-lite";
import './StartForm.css';
import {PageWeb} from "../../components";
import {useNavigate} from "react-router-dom";
import {ROUTES} from '../../constants';
import Select from "react-select";
import {Spinner} from "react-bootstrap";
import {toast} from "react-toastify";
import {useStores} from "../../models/root-store/root-store-context";
import {formatData, genericApiError} from "../../helpers";

export const StartForm: React.FC = observer(() => {
  const navigate = useNavigate();
  const rootStore = useStores()
  const [SOSynthesisProblem, setSOSynthesisProblem] = useState<any>(null)

  const [Loading, setLoading] = useState<boolean>(false)
  const [SynthesisProblemOptions, setSynthesisProblemOptions] = useState<any[]>([])

  const getSynthesisProblems = () => {
    setLoading(true)
    rootStore.environment.api.getSynthesisProblems().then((result: any) => {
      setLoading(false)
      if (result.kind === "ok") {
        setSynthesisProblemOptions(formatData(result.data.results))
      } else {
        setLoading(false)
        genericApiError()
      }
    }).catch((error: any) => {
      setLoading(false)
      genericApiError()
    })
  }


  const generateProblem = async () => {
    if (Loading) {
      toast.warn("Please wait the selected problem is being generated", {
        position: toast.POSITION.TOP_CENTER
      });
      return
    }
    let problem: any
    if (SOSynthesisProblem === null) {
      const randomElement = SynthesisProblemOptions[Math.floor(Math.random() * SynthesisProblemOptions.length)];
      setSOSynthesisProblem(randomElement)
      problem = randomElement
    } else {
      problem = SOSynthesisProblem
    }
    setLoading(true)
    rootStore.environment.api.getProblem(problem.value).then((result: any) => {
      setLoading(false)
      if (result.kind === "ok") {
        navigate(ROUTES.SYNTHESIS_EXPLORER(problem.value))
      } else {
        toast.warn("The problem cannot be generated with the current configuration, please change it and try again", {
          position: toast.POSITION.TOP_CENTER
        });
      }
    }).catch((error: any) => {
      setLoading(false)
      genericApiError()
    })

  }

  useEffect(() => {
    getSynthesisProblems()
  }, [])


  return (
    <PageWeb header header_title={"Generate Problem"}>
      <div className="row mhvh100 align-items-center p-0 m-0">
        <div className={"col-12 col-md-8 mx-auto"}>
          <div className={"card start-form-content-container"}>
            <div className={"card-body"}>
              <div className={"row"}>
                <div className={"mb-3"}>
                  <h6>Synthesis Problem</h6>
                  <Select
                    value={SOSynthesisProblem}
                    onChange={(a) => setSOSynthesisProblem(a)}
                    options={SynthesisProblemOptions}
                    placeholder={"Generate Random Synthesis"}
                    isSearchable
                    isClearable
                  />
                </div>
                <div
                  className={"start-problem-button d-flex justify-content-center align-items-center mx-auto mt-4"}
                  onClick={() => generateProblem()}
                >
                  {Loading && <><Spinner animation="border" variant="light" size="sm"/><span
                    className={"ms-1"}> Processing...</span></>}
                  {!Loading && <span>Generate Problem</span>}

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWeb>
  );
});

export default StartForm;
