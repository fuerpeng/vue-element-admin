import Mock from 'mockjs';
import { param2Obj } from 'utils';

const notice_List = [];
const count = 50;
for (let i = 0; i < count; i++) {
  notice_List.push(Mock.mock({
    notice_id: '@increment',
    title: '@ctitle(10, 20)',
    beginTime: +Mock.Random.date('T'),
    publicTime: +Mock.Random.date('T'),
    readed: '@integer(300, 500)',
    unRead: '@integer(300, 500)',
    'status|1': ['published', 'unPublish']
  }));
}

export default {
  getList: config => {
    const { title, page, limit, status } = param2Obj(config.url);
    let mockList = notice_List.filter(item => {
      if (status && item.status !== status) return false;
      /*if (type && item.type !== type) return false;*/
      if (title && item.title.indexOf(title) < 0) return false;
      return true;
    });

    const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1));
    return {
      total: mockList.length,
      items: pageList
    }
    /*let mockList = notice_List;
    return {
      total: mockList.length,
      items: mockList
    }*/
  }
};
