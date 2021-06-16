const HOBBY_WEIGHT = Number(process.env.HOBBY_WEIGHT)
const MAJOR_WEIGHT = Number(process.env.MAJOR_WEIGHT)
const AGE_WEIGHT = Number(process.env.AGE_WEIGHT);

module.exports = {
    calMatchingPoint(targetList, hobbyList, preferHobies, preferAge, preferMajors) {

        const similarPointList = targetList.reduce((total, target) => {
            const { userId: targetId, age: targetAge, major: targetMajor } = target;
            const targetHobbies = hobbyList[target.userId];

            const similarPoint = preferHobies.reduce((total, hobby) => {
                return targetHobbies.get(hobby) ? total + 1 : total;
            }, 0) * HOBBY_WEIGHT
                - Math.abs(targetAge - preferAge) * AGE_WEIGHT
                + preferMajors.reduce((total, major) => {
                    total += (targetMajor === major ? 1 : 0)
                    return total
                }, 0) * MAJOR_WEIGHT;

            total[targetId] = similarPoint
            return total;
        }, {});

        const result = targetList.sort((a, b) => {
            return similarPointList[b.userId] - similarPointList[a.userId];
        })

        return result.slice(0, 10);
    }
}