namespace INEEL.DataAccess.GEN.MigrationsGI
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class migAdjuntoID : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("GI.tab_IdeaInnovadora", "Adjunto_AdjuntoId", "GEN.Adjunto");
            DropIndex("GI.tab_IdeaInnovadora", new[] { "Adjunto_AdjuntoId" });
            DropColumn("GI.tab_IdeaInnovadora", "AdjuntoId");
            RenameColumn(table: "GI.tab_IdeaInnovadora", name: "Adjunto_AdjuntoId", newName: "AdjuntoId");
            AlterColumn("GI.tab_IdeaInnovadora", "AdjuntoId", c => c.Long(nullable: false));
            AlterColumn("GI.tab_IdeaInnovadora", "AdjuntoId", c => c.Long(nullable: false));
            CreateIndex("GI.tab_IdeaInnovadora", "AdjuntoId");
            AddForeignKey("GI.tab_IdeaInnovadora", "AdjuntoId", "GEN.Adjunto", "AdjuntoId", cascadeDelete: true);
        }
        
        public override void Down()
        {
            DropForeignKey("GI.tab_IdeaInnovadora", "AdjuntoId", "GEN.Adjunto");
            DropIndex("GI.tab_IdeaInnovadora", new[] { "AdjuntoId" });
            AlterColumn("GI.tab_IdeaInnovadora", "AdjuntoId", c => c.Long());
            AlterColumn("GI.tab_IdeaInnovadora", "AdjuntoId", c => c.String());
            RenameColumn(table: "GI.tab_IdeaInnovadora", name: "AdjuntoId", newName: "Adjunto_AdjuntoId");
            AddColumn("GI.tab_IdeaInnovadora", "AdjuntoId", c => c.String());
            CreateIndex("GI.tab_IdeaInnovadora", "Adjunto_AdjuntoId");
            AddForeignKey("GI.tab_IdeaInnovadora", "Adjunto_AdjuntoId", "GEN.Adjunto", "AdjuntoId");
        }
    }
}
