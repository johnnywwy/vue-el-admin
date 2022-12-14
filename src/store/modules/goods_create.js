import $Util from '../../common/util'

export default {
  state: {
    skus_type: 0, //sku类型 0单一 1多规格
    title: '', //商品名称
    category: [], //商品分类
    desc: '', //描述
    unit: '',//单位

    min_stock: 0, //库存预警
    display_stock: 0, //库存显示 0隐藏 1显示
    status: 0, //是否上架 0仓库，1上架
    express: '', //运费模板

    //商品大图
    banners: [],

    pprice: 0, //售价
    oprice: 0, //市场价
    cprice: 0, //成本价
    stock: 0,//总库存
    weight: 0, //重量
    volume: 0,  //体积
    code: 0,

    //规格卡片
    sku_card: [
      {
        name: '颜色',
        type: 0,
        list: [
          {
            name: '黄色',
            image: '',
            color: '',
          }, {
            name: '红色',
            image: '',
            color: '',
          }
        ]
      },
      {
        name: '尺寸',
        type: 0,
        list: [
          {
            name: 'XL',
            image: '',
            color: '',
          }, {
            name: 'XXL',
            image: '',
            color: '',
          }
        ]
      }
    ],
    //  表头
    ths: [
      {name: '商品规格', rowspan: 1, colspan: 1, width: ''},
      {name: 'sku图片', rowspan: 2, width: '60'},
      {name: '销售价', rowspan: 2, width: '100'},
      {name: '市场价', rowspan: 2, width: '100'},
      {name: '成本价', rowspan: 2, width: '100'},
      {name: '库存', rowspan: 2, width: '100'},
      {name: '体积', rowspan: 2, width: '100'},
      {name: '重量', rowspan: 2, width: '100'},
      {name: '编码', rowspan: 2, width: '100'},
    ],
    goods_type_id: '',//商品类型
    //商品属性
    goods_attrs: {
      phone_model: ''
    },
    //折扣价
    discount: 0,


  },
  getters: {
    skuLabels(state) {
      return state.sku_card.filter(v => {
        return v.list.length > 0
      })
    },
    //  获取表头
    tableThs(state, getters) {
      let length = getters.skuLabels.length
      state.ths[0].colspan = length
      state.ths[0].rowspan = length > 0 ? 1 : 2
      return state.ths
    },
    //  获取规格项的表格数据
    tableData(state) {
      //当前是否有规格卡片
      if (state.sku_card.length === 0) {
        return []
      }
      let sku_list = []
      for (let i = 0; i < state.sku_card.length; i++) {
        if (state.sku_card[i].list.length > 0) {
          sku_list.push(state.sku_card[i].list)
        }
      }
      if (sku_list.length === 0) {
        return []
      }
      let arr = $Util.cartesianProductOf(...sku_list)
      return arr.map(v => {
        let obj = {
          skus: [],
          image: '', //sku图片
          oprice: 0, //市场价
          pprice: 0, //售价
          cprice: 0, //成本价
          stock: 0,  //库存
          weight: 0, //重量
          volume: 0, //体积
          code: ''   //编码
        }
        obj.skus = v
        return obj
      })
    }


  },
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
    },
    //  增加指定规格卡片属性
    addSkuValue(state, index) {
      state.sku_card[index].list.push({
        name: '规格名称',
        image: '',
        color: ''
      })
    },
    //  删除指定规格卡片的规格属性
    delSkuValue(state, {cardIndex, valueIndex}) {
      state.sku_card[cardIndex].list.splice(valueIndex, 1)
    },
    //  修改指定卡片的规格属性
    updateSkuValue(state, {cardIndex, valueIndex, key, value}) {
      state.sku_card[cardIndex].list[valueIndex][key] = value
    },
    //  排序规格卡片的规格属性
    sortSkuValue(state, {index, value}) {
      state.sku_card[index].list = value
      // console.log(JSON.stringify(state.sku_card[index]))
    },
    //修改商品属性
    vModelGoodsAttrs(state, {key, value}) {
      state.goods_attrs[key] = value
    },

  },
  action: {}
}