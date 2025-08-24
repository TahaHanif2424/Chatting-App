import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Signup from "../../components/a-level/auth/Signup";
import Login from "../../components/a-level/auth/Login";

export default function AuthPage() {
  const [searchParams, setSearchPrams] = useSearchParams();
  const navigate=useNavigate();
  const changeMode=()=>{
    if(searchParams.get("mode")==="login"){
      navigate("/auth?mode=signup");
    }else{
    navigate("/auth?mode=login")
    }
  }
  useEffect(() => {
    if (!searchParams) {
      setSearchPrams({ mode: 'login' });
      return;
    }
    const mode = searchParams.get("mode");
    if (mode !== 'signup' && mode !== 'login') {
      setSearchPrams({ mode: 'login' })
    }
  }, [searchParams, setSearchPrams]);

  const mode = searchParams.get('mode');
  const componentRender = mode === 'login' ? <Login changeMode={changeMode} /> : <Signup changeMode={changeMode} />
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      {componentRender}
    </div>

  );
}

