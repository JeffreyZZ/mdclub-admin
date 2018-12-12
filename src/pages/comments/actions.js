import mdui, { JQ as $ } from 'mdui';
import { location } from '@hyperapp/router';
import { Comment } from 'mdclub-sdk-js';
import ObjectHelper from '../../helper/obj';
import actionsAbstract from '../../abstracts/actions/page';

let global_actions;

const searchState = {
  fields: [
    {
      name: 'comment_id',
      label: '评论ID',
    },
    {
      name: 'user_id',
      label: '用户ID',
    },
    {
      name: 'commentable_type',
      label: '类型',
      enum: [
        {
          name: '全部',
          value: '',
        },
        {
          name: '文章',
          value: 'article',
        },
        {
          name: '提问',
          value: 'question',
        },
        {
          name: '回答',
          value: 'answer',
        },
      ],
    },
    {
      name: 'commentable_id',
      label: '评论目标ID',
    },
  ],
  data: {
    comment_id: '',
    commentable_id: '',
    commentable_type: '',
    user_id: '',
  },
  isDataEmpty: true,
  isNeedRender: true,
};

export default $.extend({}, actionsAbstract, {
  /**
   * 初始化
   */
  init: props => (state, actions) => {
    actions.routeChange();
    global_actions = props.global_actions;
    global_actions.lazyComponents.searchBar.setState(searchState);

    $(document).on('search-submit', () => {
      actions.loadData();
    });

    actions.loadData();
  },

  /**
   * 销毁前
   */
  destroy: () => {
    $(document).off('search-submit');
  },

  /**
   * 加载数据
   */
  loadData: () => (state, actions) => {
    const datatableActions = global_actions.lazyComponents.datatable;

    datatableActions.setState({ order: '-create_time' });
    datatableActions.loadStart();

    const datatableState = datatableActions.getState();
    const paginationState = global_actions.lazyComponents.pagination.getState();
    const searchBarData = global_actions.lazyComponents.searchBar.getState().data;

    const data = $.extend({}, ObjectHelper.filter(searchBarData), {
      page: paginationState.page,
      per_page: paginationState.per_page,
      order: datatableState.order,
    });

    const success = (response) => {
      const columns = [
        {
          title: 'ID',
          field: 'comment_id',
          type: 'number',
        },
        {
          title: '作者',
          field: 'relationship.user.username',
          type: 'relation',
          onClick: ({ e, row }) => {
            e.preventDefault();
            global_actions.lazyComponents.dialogUser.open(row.user_id);
          },
        },
        {
          title: '内容',
          field: 'content',
          type: 'string',
        },
        {
          title: '发表时间',
          field: 'create_time',
          type: 'time',
        },
      ];

      const _actions = [
        {
          type: 'btn',
          onClick: actions.editOne,
          label: '编辑',
          icon: 'edit',
        },
        {
          type: 'btn',
          onClick: actions.deleteOne,
          label: '删除',
          icon: 'delete',
        },
      ];

      const batchActions = [
        {
          label: '批量删除',
          icon: 'delete',
          onClick: actions.batchDelete,
        },
      ];

      response.primaryKey = 'comment_id';
      response.columns = columns;
      response.actions = _actions;
      response.batchActions = batchActions;
      datatableActions.loadEnd(response);
    };

    Comment.getList(data, success);
  },

  /**
   * 编辑指定评论
   */
  editOne: comment => (state, actions) => {

  },

  /**
   * 删除指定评论
   */
  deleteOne: ({ comment_id }) => (state, actions) => {
    const confirm = () => {
      $.loadStart();
      Comment.deleteOne(comment_id, actions.deleteSuccess);
    };

    const options = {
      confirmText: '确认',
      cancelText: '取消',
    };

    mdui.confirm('删除后，你仍可以在回收站中恢复该评论', '确认删除该评论', confirm, false, options);
  },

  /**
   * 批量删除评论
   */
  batchDelete: comments => (state, actions) => {
    const confirm = () => {
      $.loadStart();

      const comment_ids = [];
      comments.map((comment) => {
        comment_ids.push(comment.comment_id);
      });

      Comment.deleteMultiple(comment_ids.join(','), actions.deleteSuccess);
    };

    const options = {
      confirmText: '确认',
      cancelText: '取消',
    };

    mdui.confirm('删除后，你仍可以在回收站中恢复这些评论', `确认删除这 ${comments.length} 条评论`, confirm, false, options);
  },
});
