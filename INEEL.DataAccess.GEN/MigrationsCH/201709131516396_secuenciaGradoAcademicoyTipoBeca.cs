namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class secuenciaGradoAcademicoyTipoBeca : DbMigration
    {
        public override void Up()
        {
            AddColumn("CH.cat_GradoAcademico", "Secuencia", c => c.Int());
            AddColumn("CH.cat_TipoBecas", "Secuencia", c => c.Int());
        }
        
        public override void Down()
        {
            DropColumn("CH.cat_TipoBecas", "Secuencia");
            DropColumn("CH.cat_GradoAcademico", "Secuencia");
        }
    }
}
