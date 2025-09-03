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
    <div className="w-screen h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-blue-600 to-pink-600 animate-gradient-shift"></div>
      
      {/* Floating orbs for visual interest */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-purple-400 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-400 rounded-full filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-400 rounded-full filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>
      
      {/* Content */}
      <div className="relative z-10">
        {componentRender}
      </div>
    </div>

  );
}

