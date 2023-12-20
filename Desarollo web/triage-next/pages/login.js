import React from 'react'
import Head from 'next/head'

const Login = (props) => {
  return (
    <>
      <div className="login-container">
        <Head>
          <title>exported project</title>
        </Head>
        <div className="login-login">
          <div className="login-frame2">
            <span className="login-text">
              <span>Login</span>
            </span>
          </div>
          <div className="login-frame3">
            <span className="login-text02">
              <span>Please fill your information below</span>
            </span>
          </div>
          <div className="login-frame14">
            <img
              src="/Login/rectangle1153-b0q4-200h.png"
              alt="Rectangle1153"
              className="login-rectangle1"
            />
            <div className="login-frame4">
              <span className="login-text04">
                <span>Name</span>
              </span>
            </div>
          </div>
          <div className="login-next-btn">
            <div className="login-next-icon">
              <div className="login-next">
                <span className="login-text06">
                  <span>Next</span>
                </span>
              </div>
              <div className="login-icon">
                <div className="login-chevronright">
                  <div className="login-group">
                    <div className="login-group1">
                      <img
                        src="/Login/pathi166-7j43.svg"
                        alt="PathI166"
                        className="login-path"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="login-frame13">
            <img
              src="/Login/line2172-t2tp.svg"
              alt="Line2172"
              className="login-line2"
            />
            <div className="login-frame8">
              <span className="login-text08">
                <span>Already have an account?</span>
              </span>
            </div>
            <div className="login-frame9">
              <span className="login-text10">
                <span>Login to your account</span>
              </span>
            </div>
          </div>
          <div className="login-frame12"></div>
          <div className="login-frame15">
            <img
              src="/Login/rectangle3181-n8r5-200h.png"
              alt="Rectangle3181"
              className="login-rectangle3"
            />
            <div className="login-frame7">
              <span className="login-text12">
                <span>E-mail</span>
              </span>
            </div>
          </div>
          <img
            src="/Login/unsplashe2i7hftbri186-7mw3-600w.png"
            alt="unsplashE2i7HftbrI186"
            className="login-unsplash-e2i7-hftbr-i"
          />
          <div className="login-menu">
            <div className="login-alignjustify">
              <div className="login-group2">
                <div className="login-group3">
                  <img
                    src="/Login/pathi350-k5rg.svg"
                    alt="PathI350"
                    className="login-path1"
                  />
                  <img
                    src="/Login/pathi350-2wva.svg"
                    alt="PathI350"
                    className="login-path2"
                  />
                  <img
                    src="/Login/pathi350-lnoo.svg"
                    alt="PathI350"
                    className="login-path3"
                  />
                  <img
                    src="/Login/pathi350-w9yv.svg"
                    alt="PathI350"
                    className="login-path4"
                  />
                </div>
              </div>
            </div>
            <div className="login-frame10">
              <span className="login-text14">
                <span>Menu</span>
              </span>
            </div>
          </div>
          <div className="login-logo-social-login">
            <div className="login-logo">
              <img
                src="/Login/vector3513-zok.svg"
                alt="Vector3513"
                className="login-vector"
              />
              <div className="login-name"></div>
            </div>
            <div className="login-social-login">
              <div className="login-socialmedialogo">
                <div className="login-facebook">
                  <img
                    src="/Login/subtract3519-zaco.svg"
                    alt="Subtract3519"
                    className="login-subtract"
                  />
                </div>
              </div>
              <div className="login-socialmedialogo1">
                <div className="login-instagram">
                  <img
                    src="/Login/subtract3523-7wd.svg"
                    alt="Subtract3523"
                    className="login-subtract1"
                  />
                </div>
              </div>
              <div className="login-socialmedialogo2">
                <div className="login-twitter">
                  <img
                    src="/Login/subtract3527-yogq.svg"
                    alt="Subtract3527"
                    className="login-subtract2"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>
        {`
          .login-container {
            width: 100%;
            display: flex;
            overflow: auto;
            min-height: 100vh;
            align-items: center;
            flex-direction: column;
          }
          .login-login {
            width: 100%;
            height: 1024px;
            display: flex;
            overflow: hidden;
            position: relative;
            align-items: flex-start;
            flex-shrink: 0;
            background-color: rgba(255, 255, 255, 1);
          }
          .login-frame2 {
            gap: 10px;
            top: 335px;
            left: 636px;
            width: 78px;
            display: flex;
            position: absolute;
            align-items: flex-start;
          }
          .login-text {
            color: rgba(47, 51, 103, 1);
            height: auto;
            font-size: 28px;
            font-style: Bold;
            text-align: left;
            font-family: Poppins;
            font-weight: 700;
            line-height: normal;
            font-stretch: normal;
            text-decoration: none;
          }
          .login-frame3 {
            gap: 10px;
            top: 389px;
            left: 636px;
            width: 267px;
            display: flex;
            position: absolute;
            align-items: flex-start;
          }
          .login-text02 {
            color: rgba(48, 52, 104, 1);
            height: auto;
            font-size: 16px;
            font-style: Medium;
            text-align: left;
            font-family: Poppins;
            font-weight: 500;
            line-height: normal;
            font-stretch: normal;
            text-decoration: none;
          }
          .login-frame14 {
            gap: 10px;
            top: 444px;
            left: 636px;
            width: 443px;
            display: flex;
            position: absolute;
            align-items: flex-start;
            flex-direction: column;
          }
          .login-rectangle1 {
            width: 443px;
            height: 64px;
            border-radius: 10px;
          }
          .login-frame4 {
            gap: 10px;
            display: flex;
            z-index: 1;
            align-items: flex-start;
          }
          .login-text04 {
            color: rgba(139, 143, 168, 1);
            height: auto;
            font-size: 16px;
            font-style: Medium;
            text-align: left;
            font-family: Poppins;
            font-weight: 500;
            line-height: normal;
            font-stretch: normal;
            text-decoration: none;
          }
          .login-next-btn {
            top: 639px;
            left: 903px;
            width: 176px;
            display: flex;
            padding: 18.5px;
            position: absolute;
            align-items: flex-start;
            border-radius: 8px;
            flex-direction: column;
            background-color: rgba(55, 179, 226, 1);
          }
          .login-next-icon {
            gap: 57px;
            width: 139px;
            display: flex;
            align-items: flex-start;
            flex-shrink: 0;
          }
          .login-next {
            display: flex;
            align-items: center;
          }
          .login-text06 {
            color: rgba(255, 255, 255, 1);
            height: auto;
            font-size: 22px;
            font-style: SemiBold;
            text-align: left;
            font-family: Poppins;
            font-weight: 600;
            line-height: normal;
            font-stretch: normal;
            text-decoration: none;
          }
          .login-icon {
            gap: 10px;
            display: flex;
            align-items: flex-start;
          }
          .login-chevronright {
            width: 33px;
            height: 33px;
            display: flex;
            position: relative;
            align-items: flex-start;
            flex-shrink: 0;
          }
          .login-group {
            top: 9.625px;
            left: 13.0625px;
            width: 6.875px;
            height: 13.75px;
            display: flex;
            position: absolute;
            align-items: flex-start;
            flex-shrink: 1;
          }
          .login-group1 {
            top: 0px;
            left: 0px;
            width: 6.875px;
            height: 13.75px;
            display: flex;
            position: absolute;
            align-items: flex-start;
            flex-shrink: 1;
          }
          .login-path {
            top: 0px;
            left: 0px;
            width: 7px;
            height: 14px;
            position: absolute;
          }
          .login-frame13 {
            gap: 55px;
            top: 743px;
            left: 636px;
            width: 443px;
            display: flex;
            position: absolute;
            flex-wrap: wrap;
            align-items: flex-end;
            flex-shrink: 0;
          }
          .login-line2 {
            width: 443px;
            height: 1px;
          }
          .login-frame8 {
            gap: 10px;
            display: flex;
            align-items: flex-start;
          }
          .login-text08 {
            color: rgba(57, 61, 110, 1);
            height: auto;
            font-size: 16px;
            font-style: Medium;
            text-align: left;
            font-family: Poppins;
            font-weight: 500;
            line-height: normal;
            font-stretch: normal;
            text-decoration: none;
          }
          .login-frame9 {
            gap: 10px;
            display: flex;
            align-items: flex-start;
          }
          .login-text10 {
            color: rgba(55, 179, 226, 1);
            height: auto;
            font-size: 16px;
            font-style: SemiBold;
            text-align: left;
            font-family: Poppins;
            font-weight: 600;
            line-height: normal;
            font-stretch: normal;
            text-decoration: none;
          }
          .login-frame12 {
            gap: 10px;
            top: 537px;
            left: 636px;
            width: 443px;
            display: flex;
            position: absolute;
            align-items: flex-start;
            flex-direction: column;
          }
          .login-frame15 {
            gap: 10px;
            top: 537px;
            left: 636px;
            width: 443px;
            display: flex;
            position: absolute;
            align-items: flex-start;
            flex-direction: column;
          }
          .login-rectangle3 {
            width: 443px;
            height: 64px;
            border-radius: 10px;
          }
          .login-frame7 {
            gap: 10px;
            display: flex;
            z-index: 1;
            align-items: flex-start;
          }
          .login-text12 {
            color: rgba(139, 143, 168, 1);
            height: auto;
            font-size: 16px;
            font-style: Medium;
            text-align: left;
            font-family: Poppins;
            font-weight: 500;
            line-height: normal;
            font-stretch: normal;
            text-decoration: none;
          }
          .login-unsplash-e2i7-hftbr-i {
            top: 0px;
            left: 0px;
            width: 524px;
            height: 1024px;
            position: absolute;
          }
          .login-menu {
            gap: 6px;
            top: 13px;
            left: 14px;
            width: 124px;
            display: flex;
            position: absolute;
            align-items: center;
          }
          .login-alignjustify {
            width: 50.000003814697266px;
            height: 50.000003814697266px;
            display: flex;
            position: relative;
            align-items: flex-start;
            flex-shrink: 0;
          }
          .login-group2 {
            top: 13.715387344360352px;
            left: 9.375000953674316px;
            width: 31.250001907348633px;
            height: 22.56951141357422px;
            display: flex;
            position: absolute;
            align-items: flex-start;
            flex-shrink: 1;
          }
          .login-group3 {
            top: 0px;
            left: 0px;
            width: 31.250001907348633px;
            height: 22.56951141357422px;
            display: flex;
            position: absolute;
            align-items: flex-start;
            flex-shrink: 1;
          }
          .login-path1 {
            top: 6.944466590881348px;
            left: 0px;
            width: 31px;
            height: 2px;
            position: absolute;
          }
          .login-path2 {
            top: 0px;
            left: 0px;
            width: 31px;
            height: 2px;
            position: absolute;
          }
          .login-path3 {
            top: 13.888932228088379px;
            left: 0px;
            width: 31px;
            height: 2px;
            position: absolute;
          }
          .login-path4 {
            top: 20.833396911621094px;
            left: 0px;
            width: 31px;
            height: 2px;
            position: absolute;
          }
          .login-frame10 {
            gap: 10px;
            display: flex;
            align-items: flex-start;
          }
          .login-text14 {
            color: rgba(255, 255, 255, 1);
            height: auto;
            font-size: 24px;
            font-style: Medium;
            text-align: left;
            font-family: Poppins;
            font-weight: 500;
            line-height: 38px;
            font-stretch: normal;
            text-decoration: none;
          }
          .login-logo-social-login {
            gap: 364px;
            top: 413px;
            left: 146px;
            width: 222px;
            display: flex;
            position: absolute;
            align-items: center;
            flex-direction: column;
          }
          .login-logo {
            gap: 17px;
            display: flex;
            align-items: center;
          }
          .login-vector {
            width: 42px;
            height: 41px;
          }
          .login-name {
            gap: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .login-social-login {
            gap: 12px;
            display: flex;
            align-self: stretch;
            align-items: center;
            flex-shrink: 0;
            justify-content: center;
          }
          .login-socialmedialogo {
            gap: 11.333333015441895px;
            display: flex;
            padding: 6.800000190734863px;
            align-items: flex-start;
            border-radius: 21.53333282470703px;
            background-color: rgba(255, 255, 255, 1);
          }
          .login-facebook {
            gap: 11.333333015441895px;
            width: 20.399999618530273px;
            height: 20.399999618530273px;
            display: flex;
            align-items: center;
            flex-shrink: 0;
            justify-content: center;
          }
          .login-subtract {
            width: 8px;
            height: 15px;
          }
          .login-socialmedialogo1 {
            gap: 11.333333015441895px;
            display: flex;
            padding: 6.800000190734863px;
            align-items: flex-start;
            border-radius: 21.53333282470703px;
            background-color: rgba(255, 255, 255, 1);
          }
          .login-instagram {
            gap: 11.333333015441895px;
            width: 20.399999618530273px;
            height: 20.399999618530273px;
            display: flex;
            align-items: center;
            flex-shrink: 0;
            justify-content: center;
          }
          .login-subtract1 {
            width: 14px;
            height: 14px;
          }
          .login-socialmedialogo2 {
            gap: 11.333333015441895px;
            display: flex;
            padding: 6.800000190734863px;
            align-items: flex-start;
            border-radius: 21.53333282470703px;
            background-color: rgba(255, 255, 255, 1);
          }
          .login-twitter {
            gap: 11.333333015441895px;
            width: 20.399999618530273px;
            height: 20.399999618530273px;
            display: flex;
            align-items: center;
            flex-shrink: 0;
            justify-content: center;
          }
          .login-subtract2 {
            width: 11px;
            height: 10px;
          }
        `}
      </style>
    </>
  )
}

export default Login
