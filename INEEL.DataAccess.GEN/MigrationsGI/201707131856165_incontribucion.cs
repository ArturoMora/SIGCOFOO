namespace INEEL.DataAccess.GEN.MigrationsGI
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class incontribucion : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("GI.tab_AutoresIdea", "ContribucionProponente_Id", "GI.cat_ContribucionProponente");
            DropIndex("GI.tab_AutoresIdea", new[] { "ContribucionProponente_Id" });
            DropColumn("GI.tab_AutoresIdea", "ContribucionProponenteId");
            RenameColumn(table: "GI.tab_AutoresIdea", name: "ContribucionProponente_Id", newName: "ContribucionProponenteId");
            AlterColumn("GI.tab_AutoresIdea", "ContribucionProponenteId", c => c.Int(nullable: false));
            AlterColumn("GI.tab_AutoresIdea", "ContribucionProponenteId", c => c.Int(nullable: false));
            CreateIndex("GI.tab_AutoresIdea", "ContribucionProponenteId");
            AddForeignKey("GI.tab_AutoresIdea", "ContribucionProponenteId", "GI.cat_ContribucionProponente", "Id", cascadeDelete: true);
        }
        
        public override void Down()
        {
            DropForeignKey("GI.tab_AutoresIdea", "ContribucionProponenteId", "GI.cat_ContribucionProponente");
            DropIndex("GI.tab_AutoresIdea", new[] { "ContribucionProponenteId" });
            AlterColumn("GI.tab_AutoresIdea", "ContribucionProponenteId", c => c.Int());
            AlterColumn("GI.tab_AutoresIdea", "ContribucionProponenteId", c => c.String());
            RenameColumn(table: "GI.tab_AutoresIdea", name: "ContribucionProponenteId", newName: "ContribucionProponente_Id");
            AddColumn("GI.tab_AutoresIdea", "ContribucionProponenteId", c => c.String());
            CreateIndex("GI.tab_AutoresIdea", "ContribucionProponente_Id");
            AddForeignKey("GI.tab_AutoresIdea", "ContribucionProponente_Id", "GI.cat_ContribucionProponente", "Id");
        }
    }
}
