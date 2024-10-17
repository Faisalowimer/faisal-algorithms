import { useEffect, useState } from "react";

interface AlgorithmVisualizerProps {
    algorithm: string // selected algo name
    steps: any[] // array of steps generated by selected algo
    target?: number // target value
    renderStep: (step: any, currentStepIndex: number, totalSteps: number) => JSX.Element // frunction to render each step
}

const algorithmInfo: Record<string, {
    description: string,
    timeComplexity: string,
    spaceComplexity: string,
}> = {
    "Linear Search": {
        description: `Linear Search scans each element of the array 
        one by one until the target value is found. It works for 
        both sorted and unsorted arrays.`,
        timeComplexity: "0(n)",
        spaceComplexity: "0(1)",
    },
    "Binary Search": {
        description: `Binary Search works by repeatedly dividing a 
        sorted array in half and comparing the middle element with
        the target value. If the target is smaller, the left half 
        is considered; if larger, the right half is considered.`,
        timeComplexity: "0(log n)",
        spaceComplexity: "0(1)",
    },
    "Depth-First Search": {
        description: `Depth-First Search (DFS) explores as far as 
        possible along a branch before backtracking. It's commonly 
        used for tree and graph traversals.`,
        timeComplexity: "0(V + E) (V: vertices, E: edges)",
        spaceComplexity: "0(V) for recursive DFS due to the call stack",
    },
    "Breadth-First Search": {
        description: `Breadth-First Search (BFS) explores all the neighbor 
        nodes at the present depth before moving on to nodes at the next depth 
        level. It's often used for shortest path problems in unweighted graphs.`,
        timeComplexity: "0(V + E) (V: vertices, E: edges)",
        spaceComplexity: "0(V) for storing nodes in the queue",
    },
    "Bubble Sort": {
        description: `Bubble Sort compares adjacent elements in an array and 
        swaps them if they are in the wrong order. It repeats this process 
        until the array is sorted.`,
        timeComplexity: "0(n^2)",
        spaceComplexity: "0(1)",
    },
    "Selection Sort": {
        description: `Selection Sort repeatedly finds the minimum element from 
        the unsorted part of the array and swaps it with the first unsorted element, 
        moving the boundary of the sorted part.`,
        timeComplexity: "0(n^2)",
        spaceComplexity: "0(1)",
    },
    "Insertion Sort": {
        description: `Insertion Sort builds the sorted array one element at a time 
        by picking elements and inserting them into their correct position in the 
        already sorted part.`,
        timeComplexity: "0(n^2)",
        spaceComplexity: "0(1)",
    },
    "Merge Sort": {
        description: `Merge Sort divides the array into two halves, 
        recursively sorts each half, and then merges the two halves 
        back together in sorted order.`,
        timeComplexity: "0(n log n)",
        spaceComplexity: "0(n) due to the extra space for the temporary arrays used during merging",
    },
    "Quick Sort": {
        description: `Quick Sort picks a pivot element, partitions the array around the pivot, 
        and recursively sorts the partitions. It works efficiently in average cases but can 
        degrade in performance in certain cases.`,
        timeComplexity: "0(n log n) (average), 0(n^2) (worst case)",
        spaceComplexity: "0(log n) for the recursion stack (best case), 0(n) (worst case)",
    },
}

const AlgorithmVisualizer: React.FC<AlgorithmVisualizerProps> = ({
    algorithm,
    steps,
    target,
    renderStep,
}) => {
    const [currentStepIndex, setCurrentStepIndex] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)

    // go to next step
    const nextStep = () => {
        if (currentStepIndex < steps.length - 1) {
            setCurrentStepIndex(currentStepIndex + 1)
        } else {
            setIsPlaying(false) // stop playing of we reach last step 
        }
    }

    // go to previous step
    const prevStep = () => {
        if (currentStepIndex > 0) {
            setCurrentStepIndex(currentStepIndex - 1)
        }
    }

    // restart visualization
    const restart = () => {
        setCurrentStepIndex(0)
        setIsPlaying(false)
    }

    // play visualization
    useEffect(() => {
        let interval: NodeJS.Timeout | null = null

        if (isPlaying) {
            interval = setInterval(() => {
                nextStep()
            }, 1000)

            // stop interval when user pauses or reaches last step
            return () => {
                if (interval) clearInterval(interval)
            }
        }
    }, [isPlaying, currentStepIndex])

    const selectedAlgo = algorithmInfo[algorithm]

    return (
        <div className=" flex flex-col items-center p-4 bg-gray-100 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Visualization for {algorithm}
            </h2>
            <div>
                {selectedAlgo
                    ? (
                        <div className="space-y-2">
                            <p className="font-semibold text-gray-700">
                                Description:
                            </p>
                            <p className="text-gray-600">
                                {selectedAlgo.description}
                            </p>
                            <p className="font-semibold text-gray-700">
                                Time Complexity:
                            </p>
                            <p className="text-gray-600">
                                {selectedAlgo.timeComplexity}
                            </p>
                            <p className="font-semibold text-gray-700">
                                Space Complexity:
                            </p>
                            <p className="text-gray-600">
                                {selectedAlgo.spaceComplexity}
                            </p>
                        </div>
                    ) : (
                        <p className="text-gray-500">
                            Select an algorithm to visualize.
                        </p>
                    )
                }
            </div>
            {(algorithm === "Linear Search" || algorithm === "Binary Search") && (
                <p className="text-xl font-semibold text-gray-700 mb-4">
                    Target: {target}
                </p>
            )}
            <div className="mb-8">
                {renderStep(steps[currentStepIndex], currentStepIndex, steps.length)}
            </div>
            <div className="flex space-x-4">
                <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className={`px-4 py-2 text-white rounded-md ${isPlaying ? "bg-red-500" : "bg-blue-500"}`}
                >
                    {isPlaying ? "Pause" : "Play"}
                </button>
                <button
                    onClick={nextStep}
                    disabled={currentStepIndex === steps.length - 1}
                    className="px-4 py-2 bg-green-500 text-white rounded-md"
                >
                    Next
                </button>
                <button
                    onClick={prevStep}
                    disabled={currentStepIndex === 0}
                    className="px-4 py-2 bg-gray-500 text-white rounded-md"
                >
                    Previous
                </button>
                <button
                    onClick={restart}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-md"
                >
                    Restart
                </button>
            </div>
        </div>
    )
}

export default AlgorithmVisualizer