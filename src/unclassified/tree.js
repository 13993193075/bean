// Element - Tree 树形控件
// label, children
// 扁平化的源数据转为树形结构数据

import sort from './sort.js'

function treeRoot (para) {
    let data = JSON.parse(JSON.stringify(para.data)), // 数据源
        evalCode = para.evalCode, // 代码字段
        evalText = para.evalText, // 文本字段
        evalFather = para.evalFather, // 父节点字段
        evalNode = para.evalNode, // 节点类型
        evalAppendix = para.evalAppendix // 数据附加

    let tree = [], // 二叉树
        data0 = JSON.parse(JSON.stringify(data))

    // 根节点
    for (let i = 0; i < data.length; i++) {
        if (!data[i].father) { // 根节点
            tree.push({
                treeItemCode: data[i][evalCode],
                treeItemText: data[i][evalText],
                treeItemFather: data[i][evalFather],
                treeItemNode: data[i][evalNode],
                treeItemAppendix: data[i][evalAppendix],
                label: data[i][evalText]
            })
            data.splice(i, 1)
            i--
        } else {
            let a = data0.find(j => {
                return j[evalCode] === data[i][evalFather]
            })
            if (!a) { // 节点数据异常：父节点未找到，置为根节点
                tree.push({
                    treeItemCode: data[i][evalCode],
                    treeItemText: data[i][evalText],
                    treeItemFather: data[i][evalFather],
                    treeItemNode: data[i][evalNode],
                    treeItemAppendix: data[i][evalAppendix],
                    label: data[i][evalText]
                })
                data.splice(i, 1)
                i--
            }
        }
    }

    // 树节点
    let iWhile = 0
    while (data.length > 0) {
        if (iWhile > data.length) {
            break
        } // 防止意外死循环

        // 正序筛查
        data = sort.sortObjectArrayMultiLevel(data, {[evalCode]: 1})
        for (let i = 0; i < data.length; i++) {
            let node = treeNode({
                dataItem: data[i],
                evalCode,
                evalText,
                evalFather,
                evalNode,
                evalAppendix,
                tree
            })
            tree = node.tree
            if (node.updated) {
                data.splice(i, 1)
                i--
            }
        }

        // 倒序筛查
        data = sort.sortObjectArrayMultiLevel(data, {[evalCode]: -1})
        for (let i = 0; i < data.length; i++) {
            let node = treeNode({
                dataItem: data[i],
                evalCode,
                evalText,
                evalFather,
                evalNode,
                evalAppendix,
                tree
            })
            tree = node.tree
            if (node.updated) {
                data.splice(i, 1)
                i--
            }
        }
        iWhile++
    }

    // console.log(tree)
    return tree
}

function treeNode (para) {
    let dataItem = para.dataItem, // 数据节点
        evalCode = para.evalCode, // 代码字段
        evalText = para.evalText, // 文本字段
        evalFather = para.evalFather, // 父节点字段
        evalNode = para.evalNode, // 节点类型
        evalAppendix = para.evalAppendix, // 数据附加
        tree = para.tree // 二叉树

    for (let i = 0; i < tree.length; i++) {
        if (dataItem[evalFather] && dataItem[evalFather] === tree[i].treeItemCode) {
            if (!(tree[i].children && tree[i].children.length > 0)) {
                tree[i].children = []
            }
            tree[i].children.push({
                treeItemCode: dataItem[evalCode],
                treeItemText: dataItem[evalText],
                treeItemFather: dataItem[evalFather],
                treeItemNode: dataItem[evalNode],
                treeItemAppendix: dataItem[evalAppendix],
                label: dataItem[evalText]
            })

            return {
                tree,
                updated: true
            }
        } else if (tree[i].treeItemFather && tree[i].treeItemFather === dataItem[evalCode]) {
            let a = JSON.parse(JSON.stringify(tree[i]))
            tree[i] = {}
            tree[i].treeItemCode = dataItem[evalCode]
            tree[i].treeItemText = dataItem[evalText]
            tree[i].treeItemFather = dataItem[evalFather]
            tree[i].treeItemNode = dataItem[evalNode]
            tree[i].treeItemAppendix = dataItem[evalAppendix]
            tree[i].label = dataItem[evalText]
            tree[i].children = []
            tree[i].children.push(a)

            return {
                tree,
                updated: true
            }
        } else if (tree[i].children && tree[i].children.length > 0) {
            let node = treeNode({
                dataItem,
                evalCode,
                evalText,
                evalFather,
                evalNode,
                evalAppendix,
                tree: tree[i].children
            })

            if (node.updated) return {
                tree,
                updated: true
            }
        }
    }
    return {
        tree,
        updated: false
    }
}

export  {
    treeRoot
}
export default  {
    treeRoot
}
