(function (common) {

    common.getInputs = function getInputs (r) {
        var defaultObstacle = {
            xPos: 650, // not on the canvas
            width: 30, // not important
            typeConfig: { height: 40 }, // not important
            yPos: 100 // not important
        }
        var o = r.horizon.obstacles.length ? r.horizon.obstacles[0] : defaultObstacle

        if (o.xPos - 50 <= 0) {
            o = r.horizon.obstacles.length > 1 ? r.horizon.obstacles[1] : defaultObstacle
        }

        return {
            speed: r.currentSpeed,
            distance: o.xPos - 50,
            width: o.width,
            height: o.typeConfig.height,
            altitude: (150 /* canvas height */ - 10 /* earth */ - o.yPos /* pos from top */ - o.typeConfig.height /* height of the obstacle */) > 40 ? 1 : 0
        }
    }

    common.getOutput = function getOutput (network, inputs) {
        var output = {}

        for (var i = 1; i < network.length; i++) {
            var layer = network[i]
            output = {}

            for (var nodeName in layer) {
                var node = layer[nodeName]
                var sum = node.bias

                for (var edgeName in node.weights) {
                    sum += node.weights[edgeName] * inputs[edgeName]
                }
                output[nodeName] = (1 / (1 + Math.exp(-sum)))
            }

            inputs = output
        }

        return output
    }

    common.shouldJump = function shouldJump (network, inputs) {
        var output = common.getOutput(network, inputs)
        return output.jump > 0.5
    }

    common.extractIntelligence = function extractIntelligence (network) {
        var values = []
        for (var i = 0; i <= 4; i++) {
            values.push(network[1][i].bias)
            values.push(network[1][i].weights.speed)
            values.push(network[1][i].weights.distance)
            values.push(network[1][i].weights.width)
            values.push(network[1][i].weights.height)
            values.push(network[1][i].weights.altitude)
        }
        values.push(network[2].jump.bias)
        values.push(network[2].jump.weights[0])
        values.push(network[2].jump.weights[1])
        values.push(network[2].jump.weights[2])
        values.push(network[2].jump.weights[3])
        values.push(network[2].jump.weights[4])
        return values
    }

    common.generateIntelligence = function generateIntelligence (values) {
        var generateNode = function generateNode (index, isFirstLayer) {
            var offset = index * 6
            var keys = isFirstLayer ? ['speed', 'distance', 'width', 'height', 'altitude'] : [0, 1, 2, 3, 4]
            return {
                bias: values[offset + 0],
                weights: {
                    [keys[0]]: values[offset + 1],
                    [keys[1]]: values[offset + 2],
                    [keys[2]]: values[offset + 3],
                    [keys[3]]: values[offset + 4],
                    [keys[4]]: values[offset + 5]
                }
            }
        }
        return [
            { speed: {}, distance: {}, width: {}, height: {}, altitude: {} },
            { 0: generateNode(0, true), 1: generateNode(1, true), 2: generateNode(2, true), 3: generateNode(3, true), 4: generateNode(4, true) },
            { jump: generateNode(5) }
        ]
    }

})(typeof module !== 'undefined' && module.exports ? module.exports : (window.common = {}));
