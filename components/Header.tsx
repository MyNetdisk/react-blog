/**
 * /* eslint-disable jsx-a11y/anchor-is-valid
 *
 * @format
 */

/** @format */

import React, {useState, useEffect, useRef} from 'react'
import Router, {withRouter} from 'next/router'
import cn from 'classnames'
import axios from 'axios'
// import Link from 'next/link'
import {Menu, Anchor} from 'antd'
import {
  createFromIconfontCN,
  HomeFilled,
  AppstoreFilled,
  TagFilled,
  GithubFilled,
  // WechatFilled,
  // AlipayOutlined,
  SearchOutlined,
  MenuOutlined,
} from '@ant-design/icons'
import Typed from 'react-typed'
import servicePath from '../config/apiUrl'
import Contact from './Contact'
import Search from './Search'
import store from '../store'
import {
  setcategoriesAction
} from '../store/actionCreators.js';

const {SubMenu} = Menu
const {Link} = Anchor

const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_2174183_dn83jy6h7ah.js',
})

type Props = {
  indexBG: boolean
  router
  getChildValue
}

const Header = ({indexBG, router, getChildValue}: Props) => {
  const [current, setcurrent] = useState('index')
  const [navArray, setnavArray] = useState([])
  const [phrase, setphrase] = useState([])
  const [beforeScrollTop, setbeforeScrollTop] = useState(0)
  const [downward, setdownward] = useState(false)
  const [upward, setupward] = useState(false)
  const [sitename, setsitename] = useState('MyNetdisk')
  const searchRef = useRef(null)

  function setcategoriesRedux(categories){
    const action = setcategoriesAction(categories)
    store.dispatch(action)
  }

  function getTypeInfo() {
    return axios(servicePath.getTypeInfo).then(res => {
      return res.data.data
    })
  }
  function getPhrase() {
    return axios(servicePath.getPhrase).then(res => {
      return res.data.data
    })
  }

  store.subscribe(()=>{
    setsitename(store.getState().sitename)
  })

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.all([getTypeInfo(), getPhrase()]).then(
        axios.spread(function (TypeInfo, Phrase) {
          setcategoriesRedux(TypeInfo.length)
          // 两个请求现在都执行完成
          setnavArray(TypeInfo)
          const phraseArr = Phrase.map((item)=>{
            return item.hitokoto
          })
          setphrase(phraseArr)
        }),
      )
      if (router.pathname === '/' || router.pathname === '/index') {
        setcurrent('index')
      } else if (router.pathname === '/categories') {
        setcurrent(router.query.id)
      } else if (router.pathname === '/tags') {
        setcurrent('tags')
      }else if (router.pathname === '/hobbies') {
        setcurrent('music')
      } else if (router.pathname === '/links') {
        setcurrent('links')
      } else if (router.pathname === '/messages') {
        setcurrent('messages')
      } else if (router.pathname === '/timeline') {
        setcurrent('timeline')
      } else if (router.pathname === '/about') {
        setcurrent('about')
      } else {
        setcurrent('')
      }
    }
    fetchData()
  }, [])

  const menuClick = e => {
    if (e.key === 'index') {
      Router.push('/index')
    } else if (e.keyPath[1] === 'categories') {
      Router.push(`/categories?id=${e.key}`)
    } else if (e.key === 'tags') {
      Router.push('/tags')
    } else if (e.key === 'messages') {
      Router.push('/messages')
    } else if (e.key === 'timeline') {
      Router.push('/timeline')
    } else if (e.key === 'about') {
      Router.push('/about')
    } else if (e.key === 'login') {
      Router.push('/login')
    }
  }

  const handleScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
    const scroll = scrollTop - beforeScrollTop
    setbeforeScrollTop(scrollTop)
    if (scroll > 0) {
      setdownward(true)
      setupward(false)
    } else if (scroll < 0) {
      setdownward(true)
      setupward(true)
    }
    if (scrollTop === 0) {
      setupward(false)
      setdownward(false)
    }
  }
  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  })

  return (
    <header className={cn('header', {'full-page': indexBG, 'not-index-bg': !indexBG})} id="header">
      <nav
        id="nav"
        className={cn('nav', {fixed: downward, visible: upward})}
        style={{opacity: '1', animation: '1s ease 0s 1 normal none running headerNoOpacity'}}>
        <div className="nav-inner clearfix">
          <div className="nav-logo">
            <span>{sitename}</span>
          </div>
          <div className="nav-menu">
            <div
              className="nav-button"
              onClick={() => {
                searchRef.current.showModal()
              }}>
              <SearchOutlined />
              搜索
            </div>
            <Menu
              mode="horizontal"
              onClick={menuClick}
              triggerSubMenuAction="hover"
              defaultSelectedKeys={[current]}
              selectedKeys={[current]}>
              <Menu.Item key="index">
                <HomeFilled />
                主页
              </Menu.Item>
              <SubMenu
                key="categories"
                popupClassName="categories-popup-item popup-item"
                // onTitleClick={subMenuClick}
                popupOffset={[0, 0]}
                // icon={<AppstoreFilled />}
                title={
                  <>
                    <AppstoreFilled />
                    <span>博客</span>
                    <IconFont type="downarrow" className="submenu-arrow" />
                  </>
                }>
                {navArray.map(item => {
                  return <Menu.Item key={item.Id}>{item.typeName}</Menu.Item>
                })}
              </SubMenu>
              <Menu.Item key="tags">
                <TagFilled />
                标签
              </Menu.Item>
              {/* <SubMenu
                key="hobbies"
                popupClassName="hobbies-popup-item popup-item"
                popupOffset={[0, 0]}
                title={
                  <>
                    <IconFont type="aihao" />
                    <span>爱好</span>
                    <IconFont type="downarrow" className="submenu-arrow" />
                  </>
                }>
                <Menu.Item key="music" icon={<IconFont type="music" />}>
                  音乐
                </Menu.Item>
                <Menu.Item key="movie" icon={<IconFont type="movie" />}>
                  电影
                </Menu.Item>
                <Menu.Item key="book" icon={<IconFont type="book" />}>
                  书单
                </Menu.Item>
              </SubMenu> */}
              {/* <SubMenu
                key="links"
                popupClassName="links-popup-item popup-item"
                popupOffset={[0, 0]}
                // icon={<IconFont type="link" />}
                title={
                  <>
                    <IconFont type="link" />
                    <span>链接</span>
                    <IconFont type="downarrow" className="submenu-arrow" />
                  </>
                }>
                <Menu.Item key="friend" icon={<IconFont type="friend" />}>
                  友链
                </Menu.Item>
                <Menu.Item key="oldblog" icon={<IconFont type="pen" />}>
                  老版技博
                </Menu.Item>
              </SubMenu> */}
              {/* <Menu.Item key="messages">
                <IconFont type="liuyan" />
                留言板
              </Menu.Item> */}
              <Menu.Item key="timeline">
                <IconFont type="timeline" />
                时间轴
              </Menu.Item>
              <Menu.Item key="about">
                <IconFont type="about" />
                关于我
              </Menu.Item>
              <Menu.Item key="login">
                {/* <IconFont type="login" /> */}
                登录
              </Menu.Item>
            </Menu>
            <div className="nav-button santiao" onClick={() => getChildValue(true)}>
              <MenuOutlined />
            </div>
          </div>
        </div>
      </nav>
      <Search ref={searchRef} />
      <div className="site-info">
        <h1 id="site-title" className="site-title">
          MyNetdisk说你想说
        </h1>
        <div id="site-subtitle" className="site-subtitle">
          <Typed
            className="subtitle"
            strings={
              [
                "世上只有一种英雄主义，就是在认清生活真相之后，依然热爱生活。",
                "There is only one heroism in the world, to see the world as it is, and to love it.",
                "如果你有梦想，就要捍卫它，人们和你说不可能，只是因为他们自己办不到。所以，如果你有理想，就去努力实现，就这样。",
                "You got a dream...you gotta protect it. People can’t do something themselves they want to tell you, you can‘t do it. If you want something, go get it. Period.",
                "学习的真谛在于，你对一向明白的事物突然获得了全新的领悟。",
                "That is what learning is. You suddenly understand something you've understood all your life, but in a new way.",
                "世上本无所谓好坏，思想使然。",
                "There is nothing either good or badbut thinking makes it so.",
                "不要悲哀地回忆过去，它已一去不复返。明智地把握现在，它是属于你的。",
                "Look not mournfully into the past. It comes not back again. Wisely improve the present: it is thine. ",
                "从来没有真正的绝境，只有心灵的迷途。",
                "Never really desperate,only the lost of the soul.",
                "别以短期的收成来评判你的每一天，而要看到你为未来播下的种子。",
                "Don't judge each day by the harvest you reap but by the seeds that you plant.",
                "如果你把所有错误拒之门外，真理将会被拒之门外。",
                "If you shut the door to all errors, truth will be shut out.",
                "生活就像骑自行车，你必须继续前行才能保持平衡。",
                "Life is like riding a bicycle. To keep your balance, you must keep moving.",
                "只要我们坚持得足够久，就能做成任何我们想做的事。",
                "We can do anything we want to if we stick to it long enough.",
                "教育是一个逐步发现自己无知的过程。",
                "Education is a progressive discovery of our own ignorance.",
                "无论你犯了多少错，或者你进步有多慢，你都走在了那些不曾尝试的人的前面。",
                "No matter how many mistakes you make or how slow you progress, you are still way ahead of everyone who isn't trying."
              ]
            }
            typeSpeed={60}
            backSpeed={60}
            loop
          />
        </div>
        <Contact />
      </div>

      <div id="scroll-down" className="scroll-down">
        <Anchor affix={false}>
          <Link title="" href="#anchor">
            <IconFont type="downarrow" className="anticon-down scroll-down-effects" />
          </Link>
        </Anchor>
      </div>
      <style jsx global>{`
        .header {
          position: relative;
          width: 100%;
          overflow: hidden;
          box-sizing: border-box;
        }

        .header.full-page {
          height: 100vh;
          background: url('/static/img/bg-wall3.jpg');
          background-position: center;
          background-size: cover;
          background-repeat: no-repeat;
        }

        .header.not-index-bg {
          height: 28rem;
          background: url('/static/img/bg-wall6.jpg');
          background-position: center;
          background-size: cover;
          background-repeat: no-repeat;
        }

        .header.not-index-bg .scroll-down,
        .header.not-index-bg .site-info {
          display: none;
        }

        .header-affix {
          position: relative;
          font-size: 1.2rem;
          font-weight: 600;
        }

        .header-affix .ant-affix {
          background-color: #3c585c;
          transition: all 0.6s linear;
        }

        .header .nav {
          position: absolute;
          top: 0;
          padding: 10px 36px;
          width: 100%;
          opacity: 0;
          transition: all 0.5s;
        }

        .header .nav.fixed {
          position: fixed;
          top: -70px;
          z-index: 1;
          background: rgba(255, 255, 255, 0.8);
          box-shadow: 0 5px 6px -5px rgba(133, 133, 133, 0.6);
          transition: transform 0.2s ease-in-out, opacity 0.2s ease-in-out;
        }

        .header .nav.fixed .nav-logo,
        .header .nav.fixed .nav-button,
        .header .nav.fixed .ant-menu-item,
        .header .nav.fixed .ant-menu-submenu {
          color: #4c4948;
          text-shadow: none;
        }

        .header .nav.visible {
          transition: all 0.5s;
          transform: translate3d(0, 100%, 0);
        }

        @keyframes headerNoOpacity {
          0% {
            transform: translateY(-70px);
          }
          100% {
            transform: translateY(0px);
          }
        }

        .header .nav-inner {
          max-width: 1200px;
          margin: 0 auto;
          font-size: 18px;
        }

        .header .nav-logo {
          float: left;
          color: #eee;
          line-height: 46px;
          font-size: 1.2rem;
          font-weight: 600;
          text-align: left;
          text-shadow: 0.1rem 0.1rem 0.2rem rgba(0, 0, 0, 0.15);
          cursor: pointer;
        }

        .header .nav-menu {
          float: right;
        }

        .nav-button {
          display: inline;
          vertical-align: middle;
          color: #eee;
          line-height: 46px;
          font-size: 1rem;
          font-weight: 600;
          text-shadow: 0.05rem 0.05rem 0.1rem rgba(0, 0, 0, 0.3);
          cursor: pointer;
        }

        .header .santiao {
          display: none;
        }

        @media screen and (max-width: 845px) {
          .header .santiao {
            display: inline-block;
          }
          .header .ant-menu {
            display: none;
          }
        }

        .ant-menu-horizontal {
          display: inline-block;
        }

        .ant-menu {
          background: none;
        }

        .ant-menu-item,
        .ant-menu-submenu {
          color: #eee;
          font-size: 1rem;
          font-weight: 600;
          text-shadow: 0.05rem 0.05rem 0.1rem rgba(0, 0, 0, 0.3);
        }

        .ant-menu-item,
        .ant-menu-submenu-title,
        .nav-button {
          padding: 0 3px;
        }

        .ant-menu-item .anticon,
        .ant-menu-submenu-title .anticon {
          margin-right: 3px;
        }

        /* .ant-menu-submenu-arrow::after {
          display: inline-block;
          content: '▼';
          width: 4px;
          height: 4px;
        } */
        .submenu-arrow {
          margin-left: 2px;
        }

        .ant-menu-submenu .ant-menu-item {
          color: #4c4948;
          font-size: 0.9rem;
        }

        .ant-menu-horizontal > .ant-menu-item,
        .ant-menu-horizontal > .ant-menu-submenu {
          border-bottom: none;
        }

        .header .nav.fixed .ant-menu-horizontal > .ant-menu-item:hover,
        .header .nav.fixed .ant-menu-horizontal > .ant-menu-submenu:hover,
        .header .nav.fixed .ant-menu-horizontal > .ant-menu-item-active,
        .header .nav.fixed .ant-menu-horizontal > .ant-menu-submenu-active,
        .header .nav.fixed .ant-menu-horizontal > .ant-menu-item-open,
        .header .nav.fixed .ant-menu-horizontal > .ant-menu-submenu-open,
        .header .nav.fixed .ant-menu-horizontal > .ant-menu-item-selected,
        .header .nav.fixed .ant-menu-horizontal > .ant-menu-submenu-selected {
          border-bottom: none;
          color: #1890ff;
        }

        .ant-menu-horizontal > .ant-menu-item:hover,
        .ant-menu-horizontal > .ant-menu-submenu:hover,
        .ant-menu-horizontal > .ant-menu-item-active,
        .ant-menu-horizontal > .ant-menu-submenu-active,
        .ant-menu-horizontal > .ant-menu-item-open,
        .ant-menu-horizontal > .ant-menu-submenu-open,
        .ant-menu-horizontal > .ant-menu-item-selected,
        .ant-menu-horizontal > .ant-menu-submenu-selected {
          border-bottom: none;
        }

        /* .ant-menu-submenu-title:hover {
          color: #3eaf7c;
        } */
        .ant-menu-horizontal:not(.ant-menu-dark) > .ant-menu-item,
        .ant-menu-horizontal:not(.ant-menu-dark) > .ant-menu-submenu {
          margin: 0 5px;
        }

        .ant-menu-horizontal:not(.ant-menu-dark) > .ant-menu-item-selected {
          border-bottom: none;
        }

        .ant-menu-horizontal {
          border-bottom: none;
        }

        .ant-menu-submenu > .ant-menu {
          background: none;
        }

        .popup-item {
          position: fixed;
          background-color: #fff;
        }

        .popup-item .ant-menu {
          min-width: 0;
        }

        .popup-item .ant-menu-item {
          padding: 0 8px;
          height: 25px;
          line-height: 25px;
        }

        .site-info {
          position: absolute;
          top: 41%;
          width: 100%;
          padding: 0 10px;
        }

        @keyframes titlescale {
          0% {
            opacity: 0;
            -ms-filter: 'progid:DXImageTransform.Microsoft.Alpha(Opacity=0)';
            filter: alpha(opacity=0);
            -webkit-transform: scale(0.7);
            -moz-transform: scale(0.7);
            -o-transform: scale(0.7);
            -ms-transform: scale(0.7);
            transform: scale(0.7);
          }
          100% {
            opacity: 1;
            -ms-filter: none;
            filter: none;
            -webkit-transform: scale(1);
            -moz-transform: scale(1);
            -o-transform: scale(1);
            -ms-transform: scale(1);
            transform: scale(1);
          }
        }

        .site-title,
        .site-subtitle {
          color: #eee;
          text-align: center;
          line-height: 1.5;
          text-shadow: 0.1rem 0.1rem 0.2rem rgba(0, 0, 0, 0.15);
          animation: titlescale 1s;
        }

        .site-title {
          font-size: 1.3rem;
          margin-bottom: 0;
        }

        @media screen and (min-width: 768px) {
          .site-title {
            font-size: 2rem;
            margin-bottom: 0;
          }
        }

        .site-subtitle {
          font-size: 0.8rem;
          margin: 0.3rem 0;
        }

        @media screen and (min-width: 768px) {
          .site-subtitle {
            font-size: 1.2rem;
            margin-bottom: 0.5rem;
          }
        }

        .scroll-down {
          display: block;
          position: absolute;
          bottom: 0;
          width: 100%;
          cursor: pointer;
          text-align: center;
        }

        .scroll-down .anticon-down {
          font-size: 30px;
          font-weight: bold;
          color: #eee;
          text-shadow: 0.1rem 0.1rem 0.2rem rgba(0, 0, 0, 0.15);
          line-height: 1.5;
        }

        .scroll-down-effects {
          position: relative;
          width: 100%;
          animation: scroll-down-effect 1.5s infinite;
        }

        @keyframes scroll-down-effect {
          0% {
            top: 0;
            opacity: 0.4;
            -ms-filter: 'progid:DXImageTransform.Microsoft.Alpha(Opacity=40)';
            filter: alpha(opacity=40);
          }
          50% {
            top: -16px;
            opacity: 1;
            -ms-filter: none;
            filter: none;
          }
          100% {
            top: 0;
            opacity: 0.4;
            -ms-filter: 'progid:DXImageTransform.Microsoft.Alpha(Opacity=40)';
            filter: alpha(opacity=40);
          }
        }

        .header .ant-anchor-wrapper {
          overflow: visible;
          background: none;
        }

        .header .ant-anchor-ink::before {
          display: none;
        }

        .header .ant-anchor-link-title {
          position: absolute;
          left: 0;
          height: 100%;
          width: 100%;
          z-index: 1;
        }
      `}</style>
    </header>
  )
}

export default withRouter(Header)
