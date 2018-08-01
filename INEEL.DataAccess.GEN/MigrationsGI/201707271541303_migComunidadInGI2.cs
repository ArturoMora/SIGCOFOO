namespace INEEL.DataAccess.GEN.MigrationsGI
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class migComunidadInGI2 : DbMigration
    {
        public override void Up()
        {
            AddColumn("GI.tab_IdeaInnovadora", "Comunidad_ComunidadId", c => c.Int());
            AlterColumn("GI.tab_IdeaInnovadora", "ComunidadPracticaId", c => c.Int(nullable: false));
            CreateIndex("GI.tab_IdeaInnovadora", "Comunidad_ComunidadId");
            AddForeignKey("GI.tab_IdeaInnovadora", "Comunidad_ComunidadId", "CP.tab_Comunidades", "ComunidadId");
        }
        
        public override void Down()
        {
            DropForeignKey("GI.tab_IdeaInnovadora", "Comunidad_ComunidadId", "CP.tab_Comunidades");
            DropIndex("GI.tab_IdeaInnovadora", new[] { "Comunidad_ComunidadId" });
            AlterColumn("GI.tab_IdeaInnovadora", "ComunidadPracticaId", c => c.String());
            DropColumn("GI.tab_IdeaInnovadora", "Comunidad_ComunidadId");
        }
    }
}
