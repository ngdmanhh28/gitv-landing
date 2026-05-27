const commands = {
  curl: [
    "curl -sL https://raw.githubusercontent.com/V-Bach/bettergit/main/install.sh | bash",
  ],
  npm: ["npm install -g @vuthebach/gitv-cli"],
  brew: ["brew tap V-Bach/gitv", "brew install gitv"],
  scoop: [
    "scoop bucket add gitv https://github.com/V-Bach/gitv-bucket.git",
    "scoop install gitv",
  ],
};

function renderCommands(target) {
  const container = document.getElementById("command-body");
  if (!container) return;
  container.innerHTML = ""; 

  const cmdList = commands[target];
  if (!cmdList) return;

  cmdList.forEach((cmd) => {
    const row = document.createElement("div");
    row.className = "command-row";
    row.innerHTML = `
      <code>${cmd}</code>
      <span class="copy-icon" onclick="copyRow(this, '${cmd}')">❐</span>
    `;
    container.appendChild(row);
  });
}


function copyRow(el, text) {
  navigator.clipboard.writeText(text).then(() => {
    el.innerText = "✓";
    el.style.color = "#4ade80"; 
    setTimeout(() => {
      el.innerText = "❐";
      el.style.color = "";
    }, 2000);
  });
}


document.querySelectorAll(".tab-btn").forEach((button) => {
  button.addEventListener("click", () => {
    document
      .querySelectorAll(".tab-btn")
      .forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    const target = button.getAttribute("data-target");
    renderCommands(target);
  });
});


document.querySelectorAll(".footer-item").forEach((item) => {
  item.addEventListener("click", (e) => {
    if (e.target.closest(".popup")) return;

    const isActive = item.classList.contains("active");

    document
      .querySelectorAll(".footer-item")
      .forEach((el) => el.classList.remove("active"));

    if (!isActive) {
      item.classList.add("active");
    }
  });
});


document.addEventListener("click", (e) => {
  if (!e.target.closest(".footer-item")) {
    document
      .querySelectorAll(".footer-item")
      .forEach((el) => el.classList.remove("active"));
  }
});


function showSection(sectionId, isFromHistory = false) {
  const sections = document.querySelectorAll(".content-section");

  // 1. Ẩn toàn bộ các section đi
  sections.forEach((section) => {
    section.classList.add("hidden");
  });

  
  const targetSection = document.getElementById(`${sectionId}-section`);
  if (targetSection) {
    targetSection.classList.remove("hidden");

    
    window.scrollTo(0, 0);

    
    if (!isFromHistory) {
      window.history.pushState({ sectionId: sectionId }, "", `#${sectionId}`);
    }
  }
}


window.addEventListener("popstate", (event) => {
  if (event.state && event.state.sectionId) {
    showSection(event.state.sectionId, true);
  } else {
    showSection("home", true);
  }
});


function toggleGroup(element) {
  const currentGroup = element.parentElement; 
  const isOpen = currentGroup.classList.contains("open");

  if (isOpen) {
    // Nếu đang mở thì đóng lại
    currentGroup.classList.remove("open");
  } else {
    // Nếu đang đóng thì chỉ mở nhóm ra
    currentGroup.classList.add("open");
    
  }
}

document.querySelectorAll(".sub-links li").forEach((subLink) => {
  subLink.addEventListener("click", (e) => {
    e.stopPropagation();

    document.querySelectorAll(".sub-links li").forEach((li) => {
      li.classList.remove("active");
    });

    subLink.classList.add("active");

    const docTarget = subLink.getAttribute("data-doc");

    document.querySelectorAll(".doc-article").forEach((article) => {
      article.classList.add("hidden");
    });

    const targetArticle = document.getElementById(`doc-${docTarget}`);
    if (targetArticle) {
      targetArticle.classList.remove("hidden");

      resetScroll();
    }
  });
});


document.querySelectorAll(".doc-internal-link").forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault();

    const targetId = this.getAttribute("href").substring(1);
    const targetArticle = document.getElementById(targetId);

    if (targetArticle) {
      document.querySelectorAll(".doc-article").forEach((article) => {
        article.classList.add("hidden");
      });

      
      targetArticle.classList.remove("hidden");

      
      window.scrollTo({ top: 0, behavior: "smooth" });

      
      const docValue = targetId.replace("doc-", "");
      const matchingSubLink = document.querySelector(`.sub-links li[data-doc="${docValue}"]`);

      if (matchingSubLink) {
        
        document.querySelectorAll(".sub-links li").forEach((li) => {
          li.classList.remove("active");
        });

        
        matchingSubLink.classList.add("active");

        const parentGroup = matchingSubLink.closest(".docs-group");
        if (parentGroup && !parentGroup.classList.contains("open")) {
          parentGroup.classList.add("open");
        }
        matchingSubLink.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    }
  });
});

function resetScroll() {
  const content = document.querySelector(".docs-content");
  if (content) {
    content.scrollTop = 0;
  }
  window.scrollTo(0, 0);
}



document.addEventListener("DOMContentLoaded", () => {
  
  
  document.querySelectorAll(".nav-links a").forEach((link) => {
    if (link.getAttribute("onclick") && link.getAttribute("onclick").includes("docs")) {
      link.addEventListener("click", (e) => {
        e.preventDefault(); 
      });
    }
  });

  
  const currentHash = window.location.hash.replace("#", "");
  
  if (currentHash === "docs") {
    showSection("docs", true);
  } else if (currentHash === "download") {
    showSection("download", true);
  } else {
    showSection("home", true);
    window.history.replaceState({ sectionId: "home" }, "", "#home");
  }

  renderCommands("curl");

  const firstGroup = document.querySelector(".docs-group");
  if (firstGroup) {
    firstGroup.classList.add("open");

    const firstSubLink = firstGroup.querySelector(".sub-links li");
    if (firstSubLink) {
      firstSubLink.classList.add("active");
    }
  }

  initSidebarFeatures();
});