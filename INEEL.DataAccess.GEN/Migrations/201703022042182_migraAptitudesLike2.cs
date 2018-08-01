namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class migraAptitudesLike2 : DbMigration
    {
        public override void Up()
        {
            AlterColumn("GEN.tab_AptitudesEmpleado", "AptitudesCatId", c => c.Int(nullable: false));
            AlterColumn("GEN.tab_LikesLinked", "Tipo", c => c.Int(nullable: false));
            CreateIndex("GEN.tab_AptitudesEmpleado", "AptitudesCatId");
            CreateIndex("GEN.tab_LikesLinked", "Tipo");
            AddForeignKey("GEN.tab_AptitudesEmpleado", "AptitudesCatId", "GEN.cat_Aptitudes", "Id", cascadeDelete: true);
            AddForeignKey("GEN.tab_LikesLinked", "Tipo", "GEN.cat_Likes", "Id", cascadeDelete: true);
        }
        
        public override void Down()
        {
            DropForeignKey("GEN.tab_LikesLinked", "Tipo", "GEN.cat_Likes");
            DropForeignKey("GEN.tab_AptitudesEmpleado", "AptitudesCatId", "GEN.cat_Aptitudes");
            DropIndex("GEN.tab_LikesLinked", new[] { "Tipo" });
            DropIndex("GEN.tab_AptitudesEmpleado", new[] { "AptitudesCatId" });
            AlterColumn("GEN.tab_LikesLinked", "Tipo", c => c.String(nullable: false));
            AlterColumn("GEN.tab_AptitudesEmpleado", "AptitudesCatId", c => c.String(nullable: false));
        }
    }
}
