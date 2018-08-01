namespace INEEL.DataAccess.GEN.MigrationsGI
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class migAdjuntoOpcional : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("GI.tab_IdeaInnovadora", "AdjuntoId", "GEN.Adjunto");
            DropIndex("GI.tab_IdeaInnovadora", new[] { "AdjuntoId" });
            AlterColumn("GI.tab_IdeaInnovadora", "AdjuntoId", c => c.Long());
            CreateIndex("GI.tab_IdeaInnovadora", "AdjuntoId");
            AddForeignKey("GI.tab_IdeaInnovadora", "AdjuntoId", "GEN.Adjunto", "AdjuntoId");
        }
        
        public override void Down()
        {
            DropForeignKey("GI.tab_IdeaInnovadora", "AdjuntoId", "GEN.Adjunto");
            DropIndex("GI.tab_IdeaInnovadora", new[] { "AdjuntoId" });
            AlterColumn("GI.tab_IdeaInnovadora", "AdjuntoId", c => c.Long(nullable: false));
            CreateIndex("GI.tab_IdeaInnovadora", "AdjuntoId");
            AddForeignKey("GI.tab_IdeaInnovadora", "AdjuntoId", "GEN.Adjunto", "AdjuntoId", cascadeDelete: true);
        }
    }
}
