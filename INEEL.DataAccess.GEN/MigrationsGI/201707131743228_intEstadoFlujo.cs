namespace INEEL.DataAccess.GEN.MigrationsGI
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class intEstadoFlujo : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("GI.tab_IdeaInnovadora", "EstadoFlujo_EstadoFlujoId", "GEN.cat_EstadoFlujo");
            DropIndex("GI.tab_IdeaInnovadora", new[] { "EstadoFlujo_EstadoFlujoId" });
            DropColumn("GI.tab_IdeaInnovadora", "EstadoFlujoId");
            RenameColumn(table: "GI.tab_IdeaInnovadora", name: "EstadoFlujo_EstadoFlujoId", newName: "EstadoFlujoId");
            AlterColumn("GI.tab_IdeaInnovadora", "EstadoFlujoId", c => c.Int(nullable: false));
            AlterColumn("GI.tab_IdeaInnovadora", "EstadoFlujoId", c => c.Int(nullable: false));
            CreateIndex("GI.tab_IdeaInnovadora", "EstadoFlujoId");
            AddForeignKey("GI.tab_IdeaInnovadora", "EstadoFlujoId", "GEN.cat_EstadoFlujo", "EstadoFlujoId", cascadeDelete: true);
        }
        
        public override void Down()
        {
            DropForeignKey("GI.tab_IdeaInnovadora", "EstadoFlujoId", "GEN.cat_EstadoFlujo");
            DropIndex("GI.tab_IdeaInnovadora", new[] { "EstadoFlujoId" });
            AlterColumn("GI.tab_IdeaInnovadora", "EstadoFlujoId", c => c.Int());
            AlterColumn("GI.tab_IdeaInnovadora", "EstadoFlujoId", c => c.String());
            RenameColumn(table: "GI.tab_IdeaInnovadora", name: "EstadoFlujoId", newName: "EstadoFlujo_EstadoFlujoId");
            AddColumn("GI.tab_IdeaInnovadora", "EstadoFlujoId", c => c.String());
            CreateIndex("GI.tab_IdeaInnovadora", "EstadoFlujo_EstadoFlujoId");
            AddForeignKey("GI.tab_IdeaInnovadora", "EstadoFlujo_EstadoFlujoId", "GEN.cat_EstadoFlujo", "EstadoFlujoId");
        }
    }
}
