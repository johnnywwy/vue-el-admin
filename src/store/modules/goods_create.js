import $Util from '../../common/util'

export default {
  state: {
    skus_type: 0, //sku类型 0单一 1多规格
    title: '', //商品名称
    category: [], //商品分类
    desc: '', //描述
    unit: '',//单位
    stock: 0, //总库存
    min_stock: 0, //库存预警
    display_stock: 0, //库存显示 0隐藏 1显示
    status: 0, //是否上架 0仓库，1上架
    express: '', //运费模板

    oprice: 0, //市场价
    pprice: 0, //售价
    cprice: 0, //成本价
    weight: 0, //重量
    volume: 0,  //体积

    //规格卡片
    sku_card: [
      {
        name: '颜色',
        type: 0,
        list: []
      }
    ]


  },
  getters: {},
  mutations: {
    //  修改state
    vModelState(state, {key, value}) {
      state[key] = value
    },
    //  增加规格卡片
    addSkuCard(state) {
      state.sku_card.push({
        name: '规格名称',
        type: 0,
        list: []
      })
    },
    //  删除卡片
    delSkuCard(state, index) {
      state.sku_card.splice(index, 1)
    },
    //  修改卡片
    vModelSkuCard(state, {key, index, value}) {
      state.sku_card[index][key] = value
    },
    //  规格卡片排序
    sortSkuCard(state, {action, index}) {
      //上移
      $Util[action](state.sku_card, index)
    }

  },
  action: {}
}