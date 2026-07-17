pipeline {
    agent any

    environment {
        IMAGE_NAME = "it-asset-register"
        CONTAINER_NAME = "it-asset-app"
        TEST_CONTAINER_NAME = "it-asset-test"
        HOST_DATA_PATH = "/home/ubuntu/it-asset-register/data"
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Source code checked out from GitHub'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t ${IMAGE_NAME}:${BUILD_NUMBER} .'
            }
        }

        stage('Test Application') {
            steps {
                sh '''
                    docker rm -f ${TEST_CONTAINER_NAME} || true

                    docker run -d \
                      --name ${TEST_CONTAINER_NAME} \
                      -p 3001:3000 \
                      ${IMAGE_NAME}:${BUILD_NUMBER}

                    sleep 5
                    curl --fail http://localhost:3001/api/assets

                    docker rm -f ${TEST_CONTAINER_NAME}
                '''
            }
        }

        stage('Deploy Container') {
            steps {
                sh '''
                    docker stop ${CONTAINER_NAME} || true
                    docker rm ${CONTAINER_NAME} || true

                    docker run -d \
                      --name ${CONTAINER_NAME} \
                      -p 3000:3000 \
                      -v ${HOST_DATA_PATH}:/app/data \
                      --restart unless-stopped \
                      ${IMAGE_NAME}:${BUILD_NUMBER}
                '''
            }
        }

        stage('Verify Deployment') {
            steps {
                sh '''
                    sleep 5
                    curl --fail http://localhost:3000/api/assets
                '''
            }
        }
    }

    post {
        success {
            echo 'Pipeline tested and deployed the application successfully'
        }

        failure {
            echo 'Pipeline failed'
            sh 'docker rm -f ${TEST_CONTAINER_NAME} || true'
        }
    }
}