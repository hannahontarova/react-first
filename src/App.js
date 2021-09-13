import React, {useState, useRef, useMemo, useEffect} from 'react';
import ClassCounter from './components/UI/ClassCounter';
import Counter from './components/UI/Counter';
import PostForm from './components/UI/PostForm';
import PostItem from './components/UI/PostItem';
import PostList from './components/UI/PostList';
import MyInput from './components/UI/input/MyInput';
import MySelect from './components/UI/select/MySelect';
import PostFilter from './components/UI/PostFilter';
import './styles/App.css';
import MyModal from './components/UI/MyModal/MyModal';
import MyButton from './components/UI/button/MyButton';
import { usePosts } from './hooks/usePosts';
import axios from 'axios';
import PostService from './API/PostService';
import Loader from './components/UI/Loader/Loader';
import { useFetching } from './hooks/useFetching';
import {getPageCount, getPagesArray} from './utils/pages'
import Pagination from './components/UI/pagination/Pagination';

function App() {
  const [posts, setPosts] = useState([])
  const [filter, setFilter] = useState({sort:'', query:''})
  const [modal, setModal] = useState(false)
  const [totalPages, setTotalPages] = useState(0)
  const [limit, setLimit] = useState(10)
  const [page, setPage] = useState(1)
  const sortedAndSearchedPosts = usePosts(posts, filter.sort, filter.query)



  const [fetchPosts, isPostsLoading, postError] = useFetching( async()=>{
    const response = await PostService.getAll(limit, page)
      setPosts(response.data)
      const totalCount = response.headers['x-total-count']
      setTotalPages(getPageCount(totalCount, limit))
  })

  useEffect(()=>{
    fetchPosts()
  }, [page])
  const createPost = (newPost) =>{
    setPosts([...posts, newPost])
    setModal(false)
  }

  // const bodyInputRef = useRef()
  // Получаем post из дочернего компонента
  const removePost = (post) =>{
    setPosts(posts.filter(p => p.id !== post.id))
  }

  const changePage = (page) => {
    setPage(page)
  }

  return (
    <div className="App">
      {/* <button onClick={fetchPosts}>get posts</button> */}
      <MyButton style={{marginTop: 30}} onClick={() => setModal(true)}>
        Create new post
      </MyButton>
      <MyModal visible={modal} setVisible={setModal}>
        <PostForm create={createPost}/>
      </MyModal>
      <hr style={{margin: '15px 0'}}/>
      <PostFilter
        filter={filter}
        setFilter={setFilter}
      />
      {
        postError &&
        <h1>error ${postError}</h1>
      }
      {isPostsLoading
        ? <div style={{display:'flex', justifyContent: 'center', marginTop: 50}}><Loader/></div>
        :<PostList remove={removePost} posts={sortedAndSearchedPosts} title='Posts list JS'/>
      }
      <Pagination
        page={page} changePage={changePage} totalPages={totalPages}
      />
    </div>
  );
}

export default App;
